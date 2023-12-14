from django.db import models

class Buyer(models.Model):
    usr_id = models.IntegerField(primary_key=True)
    usr_name = models.CharField(max_length=255)
    usr_location = models.CharField(max_length=255)

class Company(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.TextField()
    age = models.IntegerField()
    address = models.CharField(max_length=50)
    salary = models.FloatField()
