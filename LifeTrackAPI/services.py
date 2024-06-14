import requests
from decouple import config
from .models import Product
from .serializers import ProductSerializer

def fetch_from_api(api_query):
    query = api_query
    api_url = config('FOOD_API_URL')+'={}'.format(query)
    response = requests.get(api_url, headers={'X-Api-Key': config('API_KEY')})
    if response.status_code == requests.codes.ok:
        return response.json()
    else:
        print("Error:", response.status_code, response.text)

def get_or_create_product(product_name):
    try:
        product = Product.objects.get(name=product_name)
        serialized_product = ProductSerializer(product)
        print("baza")
        return serialized_product.data
    except Product.DoesNotExist:
        api_data = fetch_from_api(product_name)
        if api_data:
            api_product = api_data[0]  # Zakładamy, że dane są w pierwszym elemencie listy
            product = Product.objects.create(
                name=api_product['name'],
                protein_per_100g=api_product['protein_g'],
                carbohydrates_per_100g=api_product['carbohydrates_total_g'],
                fat_per_100g=api_product['fat_total_g'],
                calories_per_100g=api_product['calories']
            )
            print("api")
            return product
        return None