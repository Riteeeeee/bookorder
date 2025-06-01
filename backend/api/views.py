from django.contrib.auth.models import User
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order, Trade
from .serializers import OrderSerializer, TradeSerializer, UserSerializer

# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.filter(is_active=True)
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        self.match_orders(order)

    def match_orders(self, new_order):
        if new_order.order_type == "BID":
            matching_orders = Order.objects.filter(
                order_type="ASK",
                is_active=True,
                price__lte=new_order.price,
                token=new_order.token,
            ).order_by("price", "created_at")
        else:
            matching_orders = Order.objects.filter(
                order_type="BID",
                is_active=True,
                price__gte=new_order.price,
                token=new_order.token,
            ).order_by("-price", "created_at")

        remaining_quantity = new_order.quantity

        for matching_order in matching_orders:
            if remaining_quantity <= 0:
                break

            if matching_order.quantity <= remaining_quantity:
                trade_quantity = matching_order.quantity
                matching_order.is_active = False
                matching_order.save()
                remaining_quantity -= trade_quantity
            else:
                trade_quantity = remaining_quantity
                matching_order.quantity -= remaining_quantity
                matching_order.save()
                remaining_quantity = 0

            if new_order.order_type == "BID":
                bid_user, ask_user = new_order.user, matching_order.user
            else:
                bid_user, ask_user = matching_order.user, new_order.user

            Trade.objects.create(
                bid_user=bid_user,
                ask_user=ask_user,
                price=matching_order.price,
                quantity=trade_quantity,
                token=new_order.token,
            )

        if remaining_quantity <= 0:
            new_order.is_active = False
            new_order.save()
        elif remaining_quantity < new_order.quantity:
            new_order.quantity = remaining_quantity
            new_order.save()

    @action(detail=False, methods=["GET"])
    def order_book(self, request):
        token = request.query_params.get("token", "RELIANCE")
        bids = Order.objects.filter(
            order_type="BID", is_active=True, token=token
        ).order_by("-price")
        asks = Order.objects.filter(
            order_type="ASK", is_active=True, token=token
        ).order_by("price")

        return Response(
            {
                "bids": OrderSerializer(bids, many=True).data,
                "asks": OrderSerializer(asks, many=True).data,
            }
        )


class TradeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        token = self.request.query_params.get("token", "RELIANCE")
        return Trade.objects.filter(token=token).order_by("-executed_at")
