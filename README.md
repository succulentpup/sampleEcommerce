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

