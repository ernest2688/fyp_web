import React, { lazy, useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
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
  CChartPolarArea,
  CChartLine
} from '@coreui/react-chartjs'

import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'

import MainChartExample from '../charts/MainChartExample.js'
import * as Realm from "realm-web";
const app = new Realm.App({ id: "fyp_api-bhlis" });
const credentials = Realm.Credentials.anonymous();
const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

class Restaurant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      info: [],
      trending: [],
      filtered_info: [],
      name :this.props.match.params.name,
      catagories: '',
      scores: {},
      daominScores: [],
      scoreDate: ''
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
    const restaurant_info = await this.state.user.functions.get_detail_restaurant_info(this.state.name);
    console.log(restaurant_info)

    this.setState({
      info: restaurant_info.info[0],
      trending: restaurant_info.trending[0]
    })

    console.log(this.state.info)
    console.log(this.state.trending)

    this.dataMassage();

  }
  
  dataMassage = () => {
    let catagories = '';
    let cat = this.state.info.catagories;
    cat.forEach(obj => {
      catagories = catagories + obj + '/'
    })
    catagories = catagories.substring(0, catagories.length - 1);



    let scores = this.state.trending.Date_and_Scores;
    scores = scores[scores.length - 1];
    console.log(scores);
    console.log(typeof scores.Date);
    let scoreDate = scores.Date.split('T')[0];
    let domainScores = [scores.Average_food_score,scores.Average_env_score,scores.Average_service_score,scores.Average_Eng_and_emoji_score,scores.Average_score];
    console.log(domainScores);
    this.setState({
      catagories: catagories,
      daominScores: domainScores,
      scores:scores,
      scoreDate: scoreDate
    })


  }

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12" md="10" className="mb-4">
            <CCard>
              <CCardHeader>
               <h2><strong>{this.state.name}</strong></h2>
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
                      <h4><strong>District:</strong> {this.state.info.district}</h4>
                      <h4><strong>Price Range:</strong>{this.state.info.priceRange}</h4>
                      <h4><strong>Catagories:</strong> {this.state.catagories}</h4>
                    </CTabPane>
                    <CTabPane>
                      <h4><strong>Address:</strong></h4>
                      <h5>{this.state.info.address}</h5>
                      <h4><strong>Telephone:</strong></h4>
                      <h4>{this.state.info.tel}</h4>
                    </CTabPane>
                    <CTabPane>
                      <h4>{this.state.info.introduction}</h4>
                    </CTabPane>
                  </CTabContent>
                </CTabs>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>


        <CCol xs="12" md="10" className="mb-5">
          <CCard>
            <CCardHeader>
              <h3><strong>Domain Score</strong></h3>
              <h5>Up to:  {this.state.scoreDate}</h5>
              
            </CCardHeader>
            <CCardBody>
              <CChartPolarArea
                datasets={[
                  {
                    label: 'Domain Score',
                    backgroundColor: [
                      '#FF6384',
                      '#4BC0C0',
                      '#FFCE56',
                      '#E7E9ED',
                      '#000000'],
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: 'rgba(255,99,132,1)',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: this.state.daominScores
                  }
                ]}
                options={{
                  aspectRatio: 3,
                  tooltips: {
                    enabled: true
                  }
                }}
                labels={[
                  'Food', 'Environment', 'Service','Emoji', 'Total'
                ]}
              />
            </CCardBody>
          </CCard>
        </CCol>





        {/* <CCard>
          <CCardBody>
            <CRow>
              <CCol sm="5">
                <h4 id="traffic" className="card-title mb-0">Prediction of Performance</h4>
                <div className="small text-muted">up to reviews on Dec 2020</div>
              </CCol>
              <CCol sm="7" className="d-none d-md-block">
                <CButton color="primary" className="float-right">
                  <CIcon name="cil-cloud-download" />
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
            <MainChartExample style={{ height: '300px', marginTop: '40px' }} />
          </CCardBody>

        </CCard> */}
        <CCard>
          <CCardHeader>
            Prediction of trend
          </CCardHeader>
          <CCardBody>
            <CChartLine
              datasets={[
                {
                  label: 'Data One',
                  backgroundColor: 'rgb(228,102,81,0.9)',
                  data: [30, 39, 10, 50, 30, 70, 35]
                }
              ]}
              options={{
                aspectRatio: 3,
                tooltips: {
                  enabled: true
                }
              }}
              labels={[1,2,3,4,5,6,7]}
            />
          </CCardBody>
      </CCard>


      </>
    )
  }
}

export default Restaurant
