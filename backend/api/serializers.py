from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Order, Trade


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "user",
            "username",
            "price",
            "quantity",
            "order_type",
            "token",
            "created_at",
            "is_active",
        )
        read_only_fields = ("id", "created_at", "is_active")


class TradeSerializer(serializers.ModelSerializer):
    bid_username = serializers.CharField(source="bid_user.username", read_only=True)
    ask_username = serializers.CharField(source="ask_user.username", read_only=True)

    class Meta:
        model = Trade
        fields = (
            "id",
            "bid_user",
            "ask_user",
            "bid_username",
            "ask_username",
            "price",
            "quantity",
            "token",
            "executed_at",
        )
        read_only_fields = ("id", "executed_at")
