import uuid
from django.db import models

from common.models import BaseModel
from products.models import Product
from users.models import User


class Cart(BaseModel):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, related_name='carts', blank=True, null=True)

    def __str__(self):
        return str(self.uuid)


class Item(BaseModel):
    cart = models.ForeignKey(Cart, related_name='items')
    product = models.ForeignKey(Product, related_name='+')
    quantity = models.PositiveSmallIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f'{str(self.cart_id)[:8]} - {self.product_id}'

    def to_dict(self):
        return {
            'quantity': self.quantity,
            'name': self.product.name,
            'price': self.product.price,
            'image_url': self.product.image_url,
        }
