import io
import os
import pickle

import config
import matplotlib.pylab as pltt
import matplotlib.pyplot as plt
import numpy as np
import requests
import tensorflow as tf
from flask import Flask, jsonify, request
from keras._tf_keras import keras
from matplotlib import transforms
from tensorflow.keras.models import load_model
#from tensorflow.keras.preprocessing.image import img_to_array, load_img
from keras.preprocessing import image
prob = [['Pepper Bell_Bacterial spot', 'Pepper Bell_healthy', 'Potato_Early blight', 'Potato_Late blight','Potato_healthy', 'Tomato_Bacterial spot', 'Tomato_Early blight', 'Tomato_Late blight', 'Tomato_Leaf Mold', 'Tomato_Septoria leaf spot', 'Tomato_Spider mites Two spotted spider mite', 'Tomato_Target Spot', 'Tomato_Tomato YellowLeaf Curl Virus', 'Tomato_Tomato mosaic virus', 'Tomato_healthy']]
disease = np.array(prob)

def load_image(img_path, show=False):
    try:
        img = image.load_img(img_path, target_size=(128, 128))
        img_tensor = image.img_to_array(img)  # (height, width, channels)
        img_tensor = np.expand_dims(img_tensor,
                                    axis=0)  # (1, height, width, channels), add a dimension because the model expects this shape: (batch_size, height, width, channels)
        img_tensor /= 255.  # imshow expects values in the range [0, 1]

        if show:
            plt.imshow(img_tensor[0])
            plt.axis('off')
            plt.show()

        #img_tensor_flat = img_tensor.reshape((1, -1))

        return img_tensor

        """file_path = os.path.join("/home/donsoft/Documents/school/M1/S2/uv_projet/NexGen_Agri/",img_path)
        # img = load_img(file_path, target_size=(256, 256))
        # img_tensor = img_to_array(img)  # Convert the image to numpy array
        # img_tensor = np.expand_dims(img_tensor, axis=0)  # Add batch dimension
        # img_tensor /= 255.0  # Normalize to [0, 1]
        img = pltt.imread(img_path)
        resImage = resize(img, (28, 28, 3))
        image = Image.open(file_path)
        image = keras.utils.load_img(file_path)
        input_arr = keras.utils.img_to_array(image)
        img_tensor = np.array([input_arr])

        if show:
            plt.imshow(img_tensor[0])
            plt.axis('off')
            plt.show()"""

        print("Image loaded and processed")
        return img_tensor
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def plant(image_url):
    #keras.layers.TFSMLayer() keras.layers.TFSMLayer(PlantTest, call_endpoint='serving_default')  #
    new_model = tf.keras.models.load_model('/home/donsoft/Documents/school/M1/S2/uv_projet/NexGen_Agri/api/models/model.h5')
    print(new_model.summary())

    response = requests.get(image_url)
    file = open("Test.png", "wb")
    file.write(response.content)
    file.close()
    images = load_image("Test.png", show=True)
    print("Image loaded")
    print("Shape of the input tensor:", images.shape)
    pred = new_model.predict(images)
    maxElement = np.amax(pred)
    result = np.where(pred == np.amax(pred))
    healthy_flag = False
    str_split = disease[result][0].split('_')
    if str_split[1] == 'healthy':
        str_split[1] = 'No Diseases Found'
        healthy_flag = True
        info="None"
        solutions="None"
    
    elif str_split[0]=='Pepper Bell' and str_split[1]=='Bacterial spot':
        info='Bacterial leaf spot, caused by Xanthomonas campestris pv. vesicatoria, is the most common and destructive disease for peppers in the eastern United States. It is a gram-negative, rod-shaped bacterium that can survive in seeds and plant debris from one season to another'
        solutions='Crop rotation can help prevent bacterial leaf spot. Do not plant peppers or tomatoes in a location where either of these crops has been grown in the past four or five years.\nAt the end of the season, remove all crop debris from the garden and destroy it. Do not compost plant debris that may contain the disease. Once the area is clean of all visible debris, till the soil or turn it with a shovel to bury any remaining bacteria.'

    elif str_split[0]=='Potato' and str_split[1]=='Early blight':
        info='Early blight (EB) is a disease of potato caused by the fungus Alternaria solani. It is found wherever potatoes are grown. The disease primarily affects leaves and stems, but under favorable weather conditions, and if left uncontrolled, can result in considerable defoliation and enhance the chance for tuber infection.'
        solutions='Early blight can be minimized by maintaining optimum growing conditions, including proper fertilization, irrigation, and management of other pests. Grow later maturing, longer season varieties. Fungicide application is justified only when the disease is initiated early enough to cause economic loss.'
    
    elif str_split[0]=='Potato' and str_split[1]=='Late blight':
        info='Late blight is caused by the funguslike oomycete pathogen Phytophthora infestans. This potentially devastating disease can infect potato foliage and tubers at any stage of crop development.'
        solutions='Plant resistant cultivars when available.\nRemove volunteers from the garden prior to planting and space plants far enough apart to allow for plenty of air circulation.\nWater in the early morning hours, or use soaker hoses, to give plants time to dry out during the day — avoid overhead irrigation.\nDestroy all tomato and potato debris after harvest (see Fall Garden Cleanup).'
    
    elif str_split[0]=='Tomato' and str_split[1]=='Bacterial spot':
        info='Bacterial spot of tomato is caused by Xanthomonas vesicatoria, Xanthomonas euvesicatoria, Xanthomonas gardneri, and Xanthomonas perforans. These bacterial pathogens can be introduced into a garden on contaminated seed and transplants, which may or may not show symptoms.'
        solutions='A plant with bacterial spot cannot be cured. Remove symptomatic plants from the field or greenhouse to prevent the spread of bacteria to healthy plants. Burn, bury or hot compost the affected plants and DO NOT eat symptomatic fruit.'
    
    elif str_split[0]=='Tomato' and str_split[1]=='Early blight':
        info='Alternaria solani is a fungal pathogen that produces a disease in tomato and potato plants called early blight. The pathogen produces distinctive "bullseye" patterned leaf spots and can also cause stem lesions and fruit rot on tomato and tuber blight on potato.'
        solutions='Prune or stake plants to improve air circulation and reduce fungal problems.\nMake sure to disinfect your pruning shears (one part bleach to 4 parts water) after each cut.\nKeep the soil under plants clean and free of garden debris. Add a layer of organic compost to prevent the spores from splashing back up onto vegetation.\nDrip irrigation and soaker hoses can be used to help keep the foliage dry.'
    
    elif str_split[0]=='Tomato' and str_split[1]=='Late blight':
        info='Late blight is a potentially devastating disease of tomato and potato, infecting leaves, stems, tomato fruit, and potato tubers. The disease spreads quickly in fields and can result in total crop failure if untreated.'
        solutions='Use fungicide sprays based on mandipropamid, chlorothalonil, fluazinam, mancozeb to combat late blight. Fungicides are generally needed only if the disease appears during a time of year when rain is likely or overhead irrigation is practiced.'

    elif str_split[0]=='Tomato' and str_split[1]=='Leaf Mold':
        info='Leaf mold of tomato is caused by pathogen Passalora fulva. It is found throughout the world, predominantly on tomatoes grown where the relative humidity is high, particularly in plastic greenhouses. Occasionally, if conditions are just right, leaf mold of tomato can be a problem on field grown fruit.'
        solutions='Use drip irrigation and avoid watering foliage. Use a stake, strings, or prune the plant to keep it upstanding and increase airflow in and around it. Remove and destroy (burn) all plants debris after the harvest.'
    
    elif str_split[0]=='Tomato' and str_split[1]=='Septoria leaf spot':
        info='Septoria leaf spot is caused by a fungus, Septoria lycopersici. It is one of the most destructive diseases of tomato foliage and is particularly severe in areas where wet, humid weather persists for extended periods. Septoria leaf spot usually appears on the lower leaves after the first fruit sets.'
        solutions="Pinch off leaves with leaf spots and bury them in the compost pile.\nIt is okay to remove up to a third of the plant's leaves if you catch the disease early.\nDo not remove more than a third of the plant's leaves.\nKeep leaves dry to reduce spreading the disease."

    elif str_split[0]=='Tomato' and str_split[1]=='Spider mites Two spotted spider mite':
        info='The two-spotted spider mite is the most common mite species that attacks vegetable and fruit crops in New England. Spider mites can occur in tomato, eggplant, potato, vine crops such as melons, cucumbers, and other crops. Two-spotted spider mites are one of the most important pests of eggplant.'
        solutions='The best way to begin treating for two-spotted mites is to apply a pesticide specific to mites called a miticide. Ideally, you should start treating for two-spotted mites before your plants are seriously damaged. Apply the miticide for control of two-spotted mites every 7 days or so. Since mites can develop resistance to chemicals, switch to another type of miticide after three applications.'
    
    elif str_split[0]=='Tomato' and str_split[1]=='Target Spot':
        info='Also known as early blight, target spot of tomato is a fungal disease that attacks a diverse assortment of plants, including papaya, peppers, snap beans, potatoes, cantaloupe, and squash as well as passion flower and certain ornamentals.'
        solutions='The following tips for treating target spot on tomatoes should help: Remove old plant debris at the end of the growing season; otherwise, the spores will travel from debris to newly planted tomatoes in the following growing season, thus beginning the disease anew.'
    
    elif str_split[0]=='Tomato' and str_split[1]=='Tomato YellowLeaf Curl Virus':
        info='Tomato yellow leaf curl virus is a species in the genus Begomovirus and family Geminiviridae. Tomato yellow leaf curl virus (TYLCV) infection induces severe symptoms on tomato plants and causes serious yield losses worldwide. TYLCV is persistently transmitted by the sweetpotato whitefly, Bemisia tabaci (Gennadius).'
        solutions='Use a neonicotinoid insecticide, such as dinotefuran (Venom) imidacloprid (AdmirePro, Alias, Nuprid, Widow, and others) or thiamethoxam (Platinum), as a soil application or through the drip irrigation system at transplanting of tomatoes or peppers.'

    elif str_split[0]=='Tomato' and str_split[1]=='Tomato mosaic virus':
        info='Long considered a strain of TMV, ToMV is a distinct viral species, also transmitted by contact. Present on every continent, this virus is found more frequently than TMV on tomato and pepper, both in field crops and under protection.'
        solutions='There is no cure for plant viruses, management actions should be focused on preventing virus spread.'
    
    else:
        info="None"
        solutions="None"
    
    dict_out = {'Vegetable': str_split[0], 'Disease': str_split[1], 'Healthy': healthy_flag,'Information':info,'Solutions':solutions}
    os.remove('Test.png')
    return dict_out


disease_classes = ['Apple___Apple_scab',
                   'Apple___Black_rot',
                   'Apple___Cedar_apple_rust',
                   'Apple___healthy',
                   'Blueberry___healthy',
                   'Cherry_(including_sour)___Powdery_mildew',
                   'Cherry_(including_sour)___healthy',
                   'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
                   'Corn_(maize)___Common_rust_',
                   'Corn_(maize)___Northern_Leaf_Blight',
                   'Corn_(maize)___healthy',
                   'Grape___Black_rot',
                   'Grape___Esca_(Black_Measles)',
                   'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
                   'Grape___healthy',
                   'Orange___Haunglongbing_(Citrus_greening)',
                   'Peach___Bacterial_spot',
                   'Peach___healthy',
                   'Pepper,_bell___Bacterial_spot',
                   'Pepper,_bell___healthy',
                   'Potato___Early_blight',
                   'Potato___Late_blight',
                   'Potato___healthy',
                   'Raspberry___healthy',
                   'Soybean___healthy',
                   'Squash___Powdery_mildew',
                   'Strawberry___Leaf_scorch',
                   'Strawberry___healthy',
                   'Tomato___Bacterial_spot',
                   'Tomato___Early_blight',
                   'Tomato___Late_blight',
                   'Tomato___Leaf_Mold',
                   'Tomato___Septoria_leaf_spot',
                   'Tomato___Spider_mites Two-spotted_spider_mite',
                   'Tomato___Target_Spot',
                   'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
                   'Tomato___Tomato_mosaic_virus',
                   'Tomato___healthy']


# =========================================================================================

# Custom functions for calculations


def weather_fetch(city_name):
    """
    Fetch and returns the temperature and humidity of a city
    :params: city_name
    :return: temperature, humidity
    """
    api_key = config.openwheatherapi
    base_url = "http://api.openweathermap.org/data/2.5/weather?"

    complete_url = base_url + "appid=" + api_key + "&q=" + city_name
    response = requests.get(complete_url)
    x = response.json()

    if x["cod"] != "404":
        y = x["main"]

        temperature = round((y["temp"] - 273.15), 2)
        humidity = y["humidity"]
        return temperature, humidity
    else:
        return None

