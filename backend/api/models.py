from django.contrib.auth.models import User
from django.db import models


class Order(models.Model):
    ORDER_TYPES = (
        ("BID", "Bid"),
        ("ASK", "Ask"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    order_type = models.CharField(max_length=3, choices=ORDER_TYPES)
    token = models.CharField(
        max_length=10, default="RELIANCE"
    )  # Using RELIANCE as default token
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_type} - {self.quantity} @ {self.price} by {self.user.username}"


class Trade(models.Model):
    bid_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bid_trades"
    )
    ask_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="ask_trades"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    token = models.CharField(max_length=10, default="RELIANCE")
    executed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-executed_at"]

    def __str__(self):
        return f"Trade: {self.quantity} @ {self.price} between {self.bid_user.username} and {self.ask_user.username}"
