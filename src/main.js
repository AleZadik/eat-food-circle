import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
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
// import primevue css

import 'primevue/resources/themes/vela-green/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);

app.component('Dialog', Dialog)
app.component('InputText', InputText)
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

app.mount('#app')
