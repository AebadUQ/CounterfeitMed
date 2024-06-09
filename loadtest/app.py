from locust import HttpUser, TaskSet, task, between, SequentialTaskSet
# from Crypto.PublicKey import RSA
class RegisterManufactureBehavior(TaskSet):
    @task
    def rsa_task(self):

        self.client.get("/register_manufacture", headers = {'User-agent': 'your bot 0.1'})
        self.client.get("/register_distributor", headers = {'User-agent': 'your bot 0.1'}) 
        self.client.get("/register_medicine", headers = {'User-agent': 'your bot 0.1'}) 
        self.client.get("/med_verification", headers = {'User-agent': 'your bot 0.1'}) 
# # class RegisterMedicineBehavior(SequentialTaskSet):
#     @task(2)
#     def rsa_task2(self):
#         self.client.get("/register_medicine", headers = {'User-agent': 'your bot 0.1'})  # Replace with your actual endpoint

# # class BuyMedicineDistributorBehavior(SequentialTaskSet):
#     @task(3)
#     def rsa_task3(self):
#         self.client.get("/buy_medicine_distributor", headers = {'User-agent': 'your bot 0.1'})  # Replace with your actual endpoint

# # class BuyMedicinePharmacyBehavior(SequentialTaskSet):
#     @task(4)
#     def rsa_task4(self):
#         self.client.get("/buy_medicine_pharmacy", headers = {'User-agent': 'your bot 0.1'})  # Replace with your actual endpoint

# # class TraceMedicineBehavior(SequentialTaskSet):
#     @task(5)
#     def rsa_task5(self):
#         self.client.get("/trace_medicine", headers = {'User-agent': 'your bot 0.1'})  # Replace with your actual endpoint

# # class DetectCounterfietBehavior(SequentialTaskSet):
#     @task(6)
#     def rsa_task6(self):
#         self.client.get("/detect_counterfiet", headers = {'User-agent': 'your bot 0.1'})  # Replace with your actual endpoint
class WebsiteUser(HttpUser):
    # tasks = [RegisterManufactureBehavior, RegisterMedicineBehavior, BuyMedicineDistributorBehavior,BuyMedicinePharmacyBehavior, TraceMedicineBehavior, DetectCounterfietBehavior]
    tasks = [RegisterManufactureBehavior]
    wait_time = between(1,1)  # Minimal wait time .... to send requests continuously
    # host = "http://127.0.0.1:3000" 
    host = "http://127.0.0.1:3000"