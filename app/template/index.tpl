<table class="order_spec">
	<tr class="header">
		<td class="name">Наименование</td>
		<td class="price">Цена</td>
		<td class="sum">&nbsp;</td>
	</tr>
	<tr	ng-repeat='ann_item in ann_array' id="item_data_{{ann_item.id}}" >
		<td class="name">{{ann_item.name}}</td>
		<td class="price">{{ann_item.price | number_format}} руб.</td>
		<td class="sum">
			<a href="/basket/" ng-if="ann_item.in_basket==1" class="in_basket">Оформить</a>
			<a href="#" ng-if="ann_item.in_basket!=1"  ng-click="addToBasket(ann_item.id);">В корзину</a>
		</td>
	</tr>
</table>