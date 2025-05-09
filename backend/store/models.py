from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()

class Book(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    image_url = models.URLField(blank=True)

class Order(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    buyer_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
