import React, { lazy } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CDataTable,
  CRow,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import MainChartExample from '../charts/MainChartExample.js'
import usersData from '../users/UsersData'

// import { DocsLink } from 'src/reusable'
import * as Realm from "realm-web";

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const app = new Realm.App({ id: "fyp_api-bhlis" });
const credentials = Realm.Credentials.anonymous();


const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
//const fields = ['name', 'registered', 'role', 'status']
const fields = ['name','district','catagories']

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      restaurant_info: []
    };
  }

  async componentDidMount() {
    try {
      // Authenticate the user
      const newuser = await app.logIn(Realm.Credentials.anonymous());
      this.setState({
        user: newuser
      })
    } catch (err) {
      console.error("Failed to log in", err);
    }
    this.get_restaurant_info(); // after function a finished, this function will calls

  }

  get_restaurant_info = async () => {
    const restaurant_info = await this.state.user.functions.get_restaurant_info_for_dashboard();
    //console.log(restaurant_info)
    restaurant_info.forEach(obj => {
        var catagories = '';
        obj['catagories'].forEach(oobj => {
            catagories = catagories + oobj + '/'
      })
      catagories = catagories.substring(0, catagories.length - 1);
      obj['catagories'] = catagories
    });

    //console.log(restaurant_info)

    this.setState({
      restaurant_info: restaurant_info
    })

    console.log(this.state.restaurant_info)


 
}



  render() {
    return (
      <>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                Restaurants
            </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={this.state.restaurant_info}
                  fields={fields}
                  dark
                  hover
                  striped
                  bordered
                  size="sm"
                  itemsPerPage={10}
                  pagination
                  scopedSlots={{
                    // 'status':
                    //   (item) => (
                    //     <td>
                    //       <CBadge color={getBadge(item.status)}>
                    //         {item.status}
                    //       </CBadge>
                    //     </td>
                    //   )
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
  
      </>
    )
  }




}

export default Dashboard

