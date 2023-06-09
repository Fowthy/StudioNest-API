# RabbitMQ Connection and Fanout Exchanges

## Introduction

This document provides an overview of the RabbitMQ connection setup and the usage of fanout exchanges in the project. The primary purpose of RabbitMQ is to create a communication between the microservices, allowing for efficient coordination of CRUD operations on rooms across different MongoDB database instances.

## RabbitMQ Connection

I have established a connection between the Room Manager service and the Booking service using RabbitMQ, which acts as a reliable message broker. This connection enables communication between the two services, ensuring that room-related operations are synchronized across the system.

## Fanout Exchanges

To implement the communication mechanism, I utilize fanout exchanges in RabbitMQ. Fanout exchanges are designed to broadcast messages to all bound queues without any routing or filtering logic. In the project, I have the following fanout exchanges:

### 1. Room_Create Exchange

The Room_Create exchange is responsible for broadcasting room creation events from the Room Manager service to the Booking service. Whenever a new room is created, the Room Manager service publishes a message to this exchange, which is then received by all queues bound to it.

### 2. Room_Delete Exchange

The Room_Delete exchange handles room deletion events, propagating them from the Room Manager service to the Booking service. When a room is deleted, the Room Manager service publishes a message to this exchange, which is then broadcasted to all queues bound to it.

### 3. Room_Update Exchange

The Room_Update exchange facilitates room update events, allowing the Room Manager service to notify the Booking service about changes made to a room. Upon updating a room, the Room Manager service publishes a message to this exchange, which is subsequently distributed to all queues bound to it.

## MongoDB Database Instances

It's important to note that the Room Manager service and the Booking service utilize different MongoDB database instances. The fanout exchanges mentioned above are responsible for coordinating the operations between these services, ensuring that the appropriate changes are reflected consistently in their respective databases.

## Conclusion

The RabbitMQ connection and the usage of fanout exchanges in the project provide a robust and scalable solution for coordinating CRUD operations on rooms between the Room Manager service and the Booking service. 