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
_Authorization_ can be implemented using customAuthorizer lambda.

**Sample CURL requests**:

1. Get the price and name for a given product
<br>$_curl --request GET \
   --url https://ybcnx0e8x2.execute-api.eu-west-1.amazonaws.com/dev/product/PRODUCT001_
   

2. Get all the items (products) for a given order
<br>$_curl --request GET \
   --url https://ybcnx0e8x2.execute-api.eu-west-1.amazonaws.com/dev/order/ORDER005/products_

3. Get all the orders for a given customer
<br>$_curl --request GET \
   --url https://ybcnx0e8x2.execute-api.eu-west-1.amazonaws.com/dev/orders/customer/ganesh_

**Database Used**:
<br>
DynamoDB is used as backend DB.
DynamoDB is being used by a giant ecommerce app amazon. 
It's already time & stress tested, and many modeling case studies available. 

For this exercise, a single Table strategy worked. 
<br>
If we are too unsure about access patterns or not sure about how to use this data for analytics then we can rethink.

**NOTE**:
<br>
Supporting diagrams can be found in supportinDocs folder

**How to run this**:
<br>
It assumes that you've aws account and aws profile is configured in your machine.
<br>
It also assumes nodeJs(at least 10.x) runtime is installed on your machine.
<br>
Run the following commands in your terminal.

1. $ npm install -g serverless
2. clone this repo
3. Navigate to the repo
4. $ yarn install
5. yarn deploy:dev --profile [yourAWSProfileName]
