import React, { lazy , useState } from 'react'
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
  CRow,
  CSwitch,
  CCallout,
  CCardGroup,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
  CWidgetProgress
} from '@coreui/react'

import {
  CChartPolarArea
} from '@coreui/react-chartjs'

import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'

import MainChartExample from '../charts/MainChartExample.js'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const Restaurant = () => {
  const [active, setActive] = useState(1)
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.'
  return (
    <>
    <CRow>
      <CCol xs="12" md="10" className="mb-4">
        <CCard>
          <CCardHeader>
           <h1>Mamady</h1>
            {/* <DocsLink name="CTabs"/> */}
          </CCardHeader>
          <CCardBody>
            <CTabs>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink>
                    <h6>Basic Info</h6>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                  <h6>Contact</h6>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink>
                  <h6>Introduction</h6>
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane>
                  <h4><strong>District:</strong> Causeway Bay</h4>
                  <h4><strong>Price Range:</strong> $101-200</h4>
                  <h4><strong>Catagories:</strong> International/All Day Breakfast/Coffee Shop/Upper-floor Cafe</h4>
                </CTabPane>
                <CTabPane>
                  <h4><strong>Address:</strong></h4>
                  <h5>1/F, Perfect Commercial Building, 28 Sharp Street West, Causeway Bay</h5>
                  <h4><strong>Telephone:</strong></h4>
                  <h4>21640066</h4>
                </CTabPane>
                <CTabPane>
                  <h4>You can find different funny quotes in this upstairs coffee shop. The names of dishes offered are also very humorous, and the ingredients are very unique. For example the cream of Cream Risotto is changed to soy milk; Pizza is also served with salted egg.</h4>
                </CTabPane>
              </CTabContent>
            </CTabs>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

     
      <CCardGroup columns className = "cols-2" >
        <CCard>
          <CCardHeader>
            <strong>Domain Score</strong>
          </CCardHeader>
          <CCardBody>
            <CChartPolarArea
              datasets={[
                // {
                //   label: 'My First dataset',
                //   backgroundColor: 'rgba(179,181,198,0.2)',
                //   pointBackgroundColor: 'rgba(179,181,198,1)',
                //   pointBorderColor: '#fff',
                //   pointHoverBackgroundColor: 'rgba(179,181,198,1)',
                //   pointHoverBorderColor: 'rgba(179,181,198,1)',
                //   data: [65, 59, 90]
                // }
                {
                  label: 'My Second dataset',
                  backgroundColor: [
                    '#FF6384',
                    '#4BC0C0',
                    '#FFCE56',
                    '#E7E9ED'],
                  pointBackgroundColor: 'rgba(255,99,132,1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: 'rgba(255,99,132,1)',
                  pointHoverBorderColor: 'rgba(255,99,132,1)',
                  data: [3, 4, 4,3.75]
                }
              ]}
              options={{
                aspectRatio: 1.5,
                tooltips: {
                  enabled: true
                }
              }}
              labels={[
                'Food', 'Environment', 'Service','Total'
              ]}
            />
          </CCardBody>
        </CCard>
      </CCardGroup>



  
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">Traffic</h4>
              <div className="small text-muted">November 2017</div>
            </CCol>
            <CCol sm="7" className="d-none d-md-block">
              <CButton color="primary" className="float-right">
                <CIcon name="cil-cloud-download"/>
              </CButton>
              <CButtonGroup className="float-right mr-3">
                {
                  ['Day', 'Month', 'Year'].map(value => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={value === 'Month'}
                    >
                      {value}
                    </CButton>
                  ))
                }
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChartExample style={{height: '300px', marginTop: '40px'}}/>
        </CCardBody>
        <CCardFooter>
          <CRow className="text-center">
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-muted">Visits</div>
              <strong>29.703 Users (40%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="success"
                value={40}
              />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
              <div className="text-muted">Unique</div>
              <strong>24.093 Users (20%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="info"
                value={40}
              />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-muted">Pageviews</div>
              <strong>78.706 Views (60%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="warning"
                value={40}
              />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0">
              <div className="text-muted">New Users</div>
              <strong>22.123 Users (80%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                color="danger"
                value={40}
              />
            </CCol>
            <CCol md sm="12" className="mb-sm-2 mb-0 d-md-down-none">
              <div className="text-muted">Bounce Rate</div>
              <strong>Average Rate (40.15%)</strong>
              <CProgress
                className="progress-xs mt-2"
                precision={1}
                value={40}
              />
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
      

    </> 
  )
}

export default Restaurant
