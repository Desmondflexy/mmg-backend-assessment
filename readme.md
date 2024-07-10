## Task Submission for MMG Backend Assessment

Server is hosted on render https://mmg-backend-assessment-latest.onrender.com

Api documentation on postman https://documenter.getpostman.com/view/24256947/2sA3e49U9B

## Endpoints
- POST /:item/add
  - add a new lot of item
  - req.body ==> {quantity, expiry}
  - expiry must be a string in the format 'DDMMYY'

- POST /:item/sell
  - sell an item
  - req.body ==> {quantity}

- GET /:item/sell
  - get non-expired quantity