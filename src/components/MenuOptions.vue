<template>
	<div class="card">
		<DataView :value="menu" :layout="list" :paginator="true" :rows="9">
			<template #header>
			</template>

			<template #list="menu">
				<div class="col-12">
					<div class="product-list-item">
						<span class="hidden">{{ establishment.eid }}</span>
						<span class="hidden">{{ menu.data.id }}</span>
						<img :src="menu.data.img" :alt="menu.data.name" />
						<div class="product-list-detail">
							<div class="product-name">{{ menu.data.name }}</div>
							<div class="product-description">{{ menu.data.description }}</div>
							<Rating :modelValue="menu.data.rating" :readonly="true" :cancel="false"></Rating>
							<i class="pi pi-tag product-category-icon"></i><span class="product-category">{{
									menu.data.category
							}}</span>
						</div>
						<div class="product-list-action">
							<span class="product-price">${{ menu.data.price }}</span>
							<div class="quantity-button">
								<InputNumber inputId="horizontal" v-model="order[menu.data.id]" showButtons
									buttonLayout="horizontal" :step="1" decrementButtonClass="m-0 p-button-danger"
									incrementButtonClass="m-0 p-button-success" incrementButtonIcon="pi pi-plus"
									decrementButtonIcon="pi pi-minus"
									min="0" default="0"
								/>
							</div>
							<!-- <Button icon="pi pi-shopping-cart" label="Add to Cart"
								:disabled="menu.data.inventoryStatus === 'OUTOFSTOCK'"></Button> -->
							<!-- <span :class="'product-badge status-' + menu.data.inventoryStatus.toLowerCase()">{{
									menu.data.inventoryStatus
							}}</span> -->
						</div>
					</div>
				</div>
			</template>
		</DataView>
	</div>
</template>

<script>
export default {
	name: 'MenuOptions',
	props: {
		establishment: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			display: false,
			order: {},
			menu: {},
		}
	},
	mounted() {
		this.menu = this.establishment.menu;
		this.menu.forEach(menu => {
			this.order[menu.id] = 0;
		});
	},
	methods: {
	},
	watch: {
		order: {
			handler() {
				let total = 0;
				for (let [key, value] of Object.entries(this.order)) {
					let item = this.menu.find(item => item.id == key);
					total += item.price * value;
				}
				// show total as a currency
				total = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
				this.$emit('updateTotal', { order: this.order, total: total });
			}, deep: true
		},
	}
}
</script>


<style lang="scss" scoped>
.card {
	background: #ffffff;
	padding: 0rem;
	box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
	border-radius: 4px;
	margin-bottom: 2rem;
}

.p-dropdown {
	width: 14rem;
	font-weight: normal;
}

.product-name {
	font-size: 1.5rem;
	font-weight: 700;
}

.product-description {
	margin: 0 0 1rem 0;
}

.product-category-icon {
	vertical-align: middle;
	margin-right: .5rem;
}

.product-category {
	font-weight: 600;
	vertical-align: middle;
}

::v-deep(.product-list-item) {
	display: flex;
	align-items: center;
	padding: 1rem;
	width: 100%;

	img {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin-right: 2rem;
		height: 150px;
		width: auto;
	}

	.product-list-detail {
		flex: 1 1 0;
	}

	.p-rating {
		margin: 0 0 .5rem 0;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: .5rem;
		align-self: flex-end;
	}

	.product-list-action {
		display: flex;
		flex-direction: column;
	}

	.p-button {
		margin-bottom: .5rem;
	}
}

::v-deep(.product-grid-item) {
	margin: .5rem;
	border: 1px solid var(--surface-border);

	.product-grid-item-top,
	.product-grid-item-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	img {
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		margin: 2rem 0;
	}

	.product-grid-item-content {
		text-align: center;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 600;
	}
}

@media screen and (max-width: 576px) {
	.product-list-item {
		flex-direction: column;
		align-items: center;

		img {
			margin: 2rem 0;
			height: 150px;
			width: auto;
		}

		.product-list-detail {
			text-align: center;
		}

		.product-price {
			align-self: center;
		}

		.product-list-action {
			display: flex;
			flex-direction: column;
		}

		.product-list-action {
			margin-top: 2rem;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			width: 100%;
		}
	}
}
</style>