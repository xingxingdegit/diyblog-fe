import Vue from 'vue'
import { Button } from 'view-design'
import { Icon } from 'view-design'

import { Menu } from 'view-design'
import { MenuItem } from 'view-design'
import { MenuGroup } from 'view-design'
import { Submenu } from 'view-design'

import { Radio } from 'view-design'
import { RadioGroup } from 'view-design'

import { Row } from 'view-design'
import { Col } from 'view-design'

import { Layout } from 'view-design'
import { Header } from 'view-design'
import { Content } from 'view-design'
import { Footer } from 'view-design'

import { Input } from 'view-design'
import { Select } from 'view-design'
import { Option } from 'view-design'

import { Table } from 'view-design'

import { Message } from 'view-design'
import { Modal } from 'view-design'

Vue.component('Button', Button)
Vue.component('Icon', Icon)

Vue.component('Menu', Menu)
Vue.component('MenuItem', MenuItem)
Vue.component('MenuGroup', MenuGroup)
Vue.component('Submenu', Submenu)

Vue.component('Radio', Radio)
Vue.component('RadioGroup', RadioGroup)

Vue.component('Row', Row)
Vue.component('Col', Col)

Vue.component('Layout', Layout)
Vue.component('Header', Header)
Vue.component('Content', Content)
Vue.component('Footer', Footer)

Vue.component('Input', Input)
Vue.component('Select', Select)
Vue.component('Option', Option)

Vue.component('Table', Table)

Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal

import 'view-design/dist/styles/iview.css'
