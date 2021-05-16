# sampleEcommerce
This rudimentary eCommerce micro-service has REST endpoints for following functionality
1. Get the price and name for a given product
2. Get all the items (products) for a given order
3. Get all the orders for a given customer

The above functionality could be achieved by using GetItem and Query APIs of DynamoDB.

Endpoints are implemented using lambdas. Unless we know any UX issues, the default configuration should take care of scalability.

**Security**:
<br>
_Authentication_ can be implemented using Cognito
<br>
_Authorization_ can be implemented using customAuthorizer lambdas.

Sample CURL requests:

1. Get the price and name for a given product
<br>
_curl --request GET \
   --url https://ybcnx0e8x2.execute-api.eu-west-1.amazonaws.com/dev/product/PRODUCT001_
   

2. Get all the items (products) for a given order
<br>
_curl --request GET \
   --url https://ybcnx0e8x2.execute-api.eu-west-1.amazonaws.com/dev/order/ORDER005/products_

3. Get all the orders for a given customer
<br>
_curl --request GET \
   --url https://ybcnx0e8x2.execute-api.eu-west-1.amazonaws.com/dev/orders/customer/ganesh_

