import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import InputSwitch from 'primevue/inputswitch';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import Sidebar from 'primevue/sidebar';
import Menubar from 'primevue/menubar';
import ProgressSpinner from 'primevue/progressspinner';
import Chip from 'primevue/chip';
import Chips from 'primevue/chips';
import DataView from 'primevue/dataview';
import Panel from 'primevue/panel';
import Slider from 'primevue/slider';
import Skeleton from 'primevue/skeleton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tooltip from 'primevue/tooltip';
import FoodCircleOverlay from './components/FoodCircleOverlay.vue';
// import primevue css

import 'primevue/resources/themes/vela-green/theme.css';
import "primeflex/primeflex.css";
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);

pinia.use(({ store }) => {
    store.$router = markRaw(router);
    store.$toast = markRaw(app.config.globalProperties.$toast);
});
app.use(router);

app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Button', Button)
app.component('Toast', Toast)
app.component('Checkbox', Checkbox)
app.component('Dropdown', Dropdown)
app.component('InputNumber', InputNumber)
app.component('InputMask', InputMask)
app.component('InputSwitch', InputSwitch)
app.component('Password', Password)
app.component('RadioButton', RadioButton)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Sidebar', Sidebar)
app.component('Menubar', Menubar)
app.component('ProgressSpinner', ProgressSpinner);
app.component('Chip', Chip);
app.component('Chips', Chips);
app.component('DataView', DataView);
app.component('Panel', Panel);
app.component('Slider', Slider);
app.component('Skeleton', Skeleton);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('FoodCircleOverlay', FoodCircleOverlay);

app.directive('tooltip', Tooltip);
app.mount('#app')
