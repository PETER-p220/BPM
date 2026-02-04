
import GuestHeader from '@layouts/Partials/GuestHeader.vue'
import AppSidebar from '@layouts/Partials/AppSidebar.vue'
import AppHeader from '@layouts/Partials/AppHeader.vue'
import AppHeader1 from '@layouts/Partials/AppHeader1.vue'
import AppNavigation from '@layouts/Partials/AppNavigation.vue'
import MobileSidebar from '@layouts/Partials/MobileSidebar.vue'
import MobileSidebar1 from '@layouts/Partials/MobileSidebar1.vue'
import ProfileDropdown from '@layouts/Partials/ProfileDropdown.vue'
import ProfileDropdown1 from '@layouts/Partials/ProfileDropdown1.vue'
import PageHeader from '@layouts/Partials/PageHeader.vue'
import AppSidebar1 from '@layouts/Partials/AppSidebar1.vue'
import BaseCard from '@components/Ui/BaseCard.vue'

import BaseInput from '@components/Form/BaseInput.vue'
import BaseCheckbox from '@components/Form/BaseCheckbox.vue'
import BaseLabel from '@components/Form/BaseLabel.vue'
import BaseButton from '@components/Form/BaseButton.vue'
import BaseLink from '@components/Form/BaseLink.vue'
import FormError from '@components/Form/FormError.vue'

import ParentTransition from '@layouts/Transitions/ParentTransition.vue'
import ChildTransition from '@layouts/Transitions/ChildTransition.vue'
import TendersSideBar from '@layouts/Partials/TendersSideBar.vue'
import ProfileDropdown2 from  '@layouts/Partials/ProfileDropdown2.vue'
import MobileSidebar2 from '@layouts/Partials/MobileSidebar2.vue'
import AppSidebar2 from '@layouts/Partials/AppSidebar2.vue'
import AppHeader2   from '@layouts/Partials/AppHeader2.vue'


import HodSideBar from '@layouts/Partials/HodSideBar.vue'
import ProfileDropdown3 from  '@layouts/Partials/ProfileDropdown3.vue'
import MobileSidebar3 from '@layouts/Partials/MobileSidebar3.vue'
import AppSidebar3 from '@layouts/Partials/AppSidebar3.vue'
import AppHeader3   from '@layouts/Partials/AppHeader3.vue'
import AccoutantSideBar from '@layouts/Partials/AccoutantSideBar.vue'
import ProfileDropdown4 from  '@layouts/Partials/ProfileDropdown4.vue'
import MobileSidebar4 from '@layouts/Partials/MobileSidebar4.vue'
import AppSidebar4 from '@layouts/Partials/AppSidebar4.vue'
import AppHeader4   from '@layouts/Partials/AppHeader4.vue'
import AppNavigation1 from '@layouts/Partials/AppNavigation1.vue'
import AppHeader5 from '../layouts/Partials/AppHeader5.vue'
import AppSidebar5 from '../layouts/Partials/AppSidebar5.vue'
import HrSideBar from '../layouts/Partials/HrSideBar.vue'
import MobileSidebar5 from '../layouts/Partials/MobileSidebar5.vue'
import ProfileDropdown5 from '../layouts/Partials/ProfileDropdown5.vue'


export default app => {
  app.component('GuestHeader', GuestHeader)
  app.component('AppSidebar', AppSidebar)
  app.component('AppHeader', AppHeader)
  app.component('AppHeader1',AppHeader1)
  app.component('AppNavigation', AppNavigation)
  app.component('MobileSidebar', MobileSidebar)
  app.component('MobileSidebar1',MobileSidebar1)
  app.component('ProfileDropdown', ProfileDropdown)
  app.component('ProfileDropdown1',ProfileDropdown1)
  app.component('PageHeader', PageHeader)
  app.component('AppSidebar1', AppSidebar1)
  

  app.component('BaseCard', BaseCard)

  app.component('BaseInput', BaseInput)
  app.component('BaseCheckbox', BaseCheckbox)
  app.component('BaseLabel', BaseLabel)
  app.component('BaseButton', BaseButton)
  app.component('BaseLink', BaseLink)
  app.component('FormError', FormError)

  app.component('ParentTransition', ParentTransition)
  app.component('ChildTransition', ChildTransition)
  app.component('TendersSideBar',TendersSideBar)
  app.component('ProfileDropdown2',ProfileDropdown2)
  app.component('MobileSidebar2',MobileSidebar2)
  app.component('AppSidebar2',AppSidebar2)
  app.component('AppHeader2',AppHeader2)

  app.component('HodSideBar',HodSideBar)
  app.component('ProfileDropdown3',ProfileDropdown3)
  app.component('MobileSidebar3',MobileSidebar3)
  app.component('AppSidebar3',AppSidebar3)
    app.component('AppSidebar3',AppSidebar5)
  app.component('AppHeader3',AppHeader3)
  app.component('AccoutantSideBar',AccoutantSideBar)
    app.component('HrSideBar',HrSideBar)
  app.component('ProfileDropdown4',ProfileDropdown4)
  app.component('ProfileDropdown5', ProfileDropdown5)
  app.component('MobileSidebar4',MobileSidebar4)
    app.component('MobileSidebar5',MobileSidebar5)
  app.component('AppSidebar4',AppSidebar4)
    app.component('AppSidebar5',AppSidebar5)
  app.component('AppHeader4',AppHeader4)
  app.component('AppHeader5',AppHeader5)
  app.component('AppNavigation1',AppNavigation1)
  
}
