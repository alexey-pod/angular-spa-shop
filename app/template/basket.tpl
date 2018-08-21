<div style="padding:15px;" ng-if="basket.summa!=0">
	<a href="#" ng-click="clearBasket();">Очистить корзину</a>
</div>
<table class="order_spec" ng-if="basket.summa!=0">
	<tbody>
		<tr class="header">
			<td class="delete"></td>
			<td class="name">Наименование</td>
			<td class="price">Цена</td>
			<td class="qty">Кол-во</td>
			<td class="sum">Сумма</td>
		</tr>
	</tbody>
	<tbody id="order_spec_tbody">
		<tr	ng-repeat='ann_item in basket.ann_array' class="item" id="item_data_{{ann_item.id}}" >
			<td class="delete" title="удалить" ng-click="deleteFromBasket(ann_item.id);"></td>
			<td class="name">{{ann_item.name}}</td>
			<td class="price">{{ann_item.price | number_format}} руб.</td>
			<td class="qty">
				<input_amount qty="{{ann_item.qty}}" ann_id="{{ann_item.id}}"></input_amount>  шт
			</td>
			<td class="sum">{{ann_item.summa | number_format}} руб.</td>
		</tr>
	</tbody>
	<tbody>
		<tr class="total">
			<td class="delete"></td>
			<td colspan="2" class="name">Итого</td>
			<td colspan="2" class="sum"><span id="basket_total_summa">{{basket.summa | number_format}}</span> руб.</td>
		</tr>
	</tbody>
</table>

<div class="basket_empty" ng-if="basket.summa==0">
	<img src="/img/basket_empty.png" alt="Для оформления заказа - добавьте товары в корзину" title="Для оформления заказа - добавьте товары в корзину">
</div>