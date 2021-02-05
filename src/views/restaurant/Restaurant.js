import React, { lazy, useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
  CTooltip,
  CLink,
  CWidgetIcon,
  CWidgetProgress,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CWidgetDropdown,
  CContainer,
  CDataTable,
  CBadge,
  CCardFooter,
  CWidgetProgressIcon
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  CChartPolarArea,
  CChartLine,
  CChartRadar
} from '@coreui/react-chartjs'


import usersData from '../users/UsersData'
import MainChartExample from '../charts/MainChartExample.js'
import * as Realm from "realm-web";
const app = new Realm.App({ id: "fyp_api-bhlis" });
const credentials = Realm.Credentials.anonymous();
const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))
const hashtags_fields = ['rank', 'hashtag', 'count']
const getBadge = status => {
  switch (status) {
    case 'increase': return 'success'
    case 'neutral': return 'secondary'
    case 'decrease': return 'danger'
    default: return 'primary'
  }
}
const data = [{week:'1 week ago', change: "10%", trend:'increase'},
              {week:'3 weeks ago', change: "20%", trend:'increase'},
              {week:'6 weeks ago', change: "30%", trend:'decrease'},
                {week:'9 weeks ago', change: "0%", trend:'neutral'},
                {week:'12 weeks ago', change: "70%", trend:'increase'}]
const trend_change_fields = ['week',"change",'trend']


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
      scoreDate: '',
      trendScores:[],
      trendDates:[],
      pop_comments:{},
      highest_score_comment:{},
      top_hashtags:[],
      hashtag_counts:[]

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
    console.log("haha")
    console.log(restaurant_info)

    this.setState({
      info: restaurant_info.info[0],
      trending: restaurant_info.trending[0],
      pop_comments: restaurant_info.most_common_hashtags[0]
    })

    console.log(this.state.info)
    console.log(this.state.trending)
    console.log(this.state.pop_comments)

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
    
    
    let trendScores = [];
    let trendDates = [];
    this.state.trending.Date_and_Scores.forEach((e,index)=> {
      trendScores.push(e.Average_score);
      trendDates.push(e.Date.split('T')[0]);
    });

    let numbers = [1,3,6,9,12];
    let scoreChange = [];
    numbers.forEach((e)=>{
      let week = (e == 1) ? '1 week ago' : e + " weeks ago";
      let percent= ((((trendScores[trendScores.length-1]-trendScores[trendScores.length-1-e])/trendScores[trendScores.length-1-e])*100).toFixed(2));
      let trend = '';
      if(percent == 0) trend = 'neutral';
      else if(percent < 0) trend = 'decrease';
      else if(percent > 0) trend = 'increase';
      
      scoreChange.push({
        week:week,
        change:percent + '%',
        trend:trend
      })

    });
    
   

    console.log(scoreChange)
    
   
    

  
    let highest_score_comment = this.state.pop_comments.highest_score_comment;

    console.log(trendScores);
    console.log(trendDates);
    console.log(highest_score_comment);

    let top_hashtags = this.state.pop_comments.Top_Hashtags;
    console.log(top_hashtags);
    
    let hashtag_counts = [];
    top_hashtags.forEach((e,index)=>{
      for (const [key, value] of Object.entries(e)) {
        hashtag_counts.push({rank:index+1,hashtag:key,count:value});
      }
    });

    hashtag_counts.pop();
    console.log(hashtag_counts);




    this.setState({
      catagories: catagories,
      daominScores: domainScores,
      scores:scores,
      scoreDate: scoreDate,
      trendScores:trendScores,
      trendDates:trendDates,
      highest_score_comment: highest_score_comment,
      hashtag_counts : hashtag_counts,
      scoreChange: scoreChange
    })


  }

  render() {
    return (
      <>
      
        <CRow>
        <CCol xs="12" sm="6" lg="8">
        <CCard>
          <CCardHeader>
          <h1><strong>{this.state.name}</strong></h1>
            {/* <DocsLink name="CTooltip"/> */}
          </CCardHeader>
          <CCardBody>
          <h4><strong>District:</strong> {this.state.info.district}</h4>
          <h4><strong>Price Range:</strong>{this.state.info.priceRange}</h4>
          <h4><strong>Catagories:</strong> {this.state.catagories}</h4>
          <h4><strong>Address:</strong></h4> <h5>{this.state.info.address}</h5>
          <h4><strong>Telephone:</strong></h4> <h4>{this.state.info.tel}</h4>
          
          <hr/>
          <h4><strong>Introduction:</strong></h4>
          <h4>{this.state.info.introduction}</h4>

           </CCardBody>
        </CCard>
        </CCol>

       
        

      <CCol xs="12" sm="6" lg="4">  
        <CCard>
          <CCardHeader>
            <h3><strong>Domain Score  <div >{this.state.daominScores[4]}/5</div></strong></h3>
            <h5>Up to:  {this.state.scoreDate}</h5>
          </CCardHeader>
          <CCardBody>
            <CChartRadar
              datasets={[
                {
                  label: 'domains',
                  backgroundColor: 'rgba(75,192,192,0.1)',
                  borderColor: 'rgba(75,192,192,0.7)',
                  pointBackgroundColor: 'rgba(75,192,192,1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(75,192,192,1)',
                  tooltipLabelColor: 'rgba(75,192,192,1)',
                  data: this.state.daominScores.slice(0, -1)
                }
              ]}
              options={{
                scale: {
                  ticks: {
                      max: 5,
                      min: 0,
                      stepSize: 0.5
                  }
              },        
                aspectRatio: 1.5,
                tooltips: {
                  enabled: true
                },

              }}
              labels={[
                'Food', 'Environment', 'Service','Emoji'
              ]}
            />
          </CCardBody>
        </CCard>
        </CCol>
        </CRow>

        <CRow>
        <CCol xs="12" sm="6" lg="12">
        <CCard>
          <CCardHeader>
          <h3><strong>Review Summary</strong></h3>
          </CCardHeader>
          <CCardBody>
          <h4>{this.state.pop_comments.Summary}</h4>
           </CCardBody>
        </CCard>
        </CCol>
        </CRow>
      

        <CRow>
        <CCol xs="12" lg="6">
          <CCard>
            <CCardHeader>
              <h3><strong>Top 10 Hashtags</strong></h3>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={this.state.hashtag_counts}
              fields= {hashtags_fields}
              itemsPerPage={7}
              size="sm"
            />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs="12"  lg="6">
        <CCard>
          <CCardHeader>
          <h3><strong>Highest Score Comment</strong></h3>
          </CCardHeader>
          <CCardBody>
          <h5>{this.state.highest_score_comment.Caption}</h5>
            <hr/>
            <div>
             <p>Food:{this.state.highest_score_comment.Average_caption_food_score}</p>
             <p>Environment:{this.state.highest_score_comment.Average_caption_env_score}</p>
             <p>Service:{this.state.highest_score_comment.Average_caption_service_score}</p>
             <p>Emoji:{this.state.highest_score_comment.Average_caption_env_score}</p>
             <p>Overall:{this.state.highest_score_comment.Average_caption_score}</p>
            </div>
            
           </CCardBody>
           <CCardFooter>
              comment date: {this.state.highest_score_comment.Date}
           </CCardFooter>
        </CCard>
        
        </CCol>
        </CRow>
      
        <CCard>
          <CCardHeader>
            <h3><strong>Trending</strong></h3>
          </CCardHeader>
          <CCardBody>
            <CChartLine
              datasets={[
                {
                  label: 'Average overall Score trending',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(75,192,192,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.state.trendScores
                }
              ]}
              options={{
                scales: {
                  yAxes: [{
                      ticks: {
                        max: 5,
                        min: 2,
                        stepSize: 0.5
                      }
                  }]
              },        
                aspectRatio: 3,
                tooltips: {
                  enabled: true
                },

              }}
              labels={this.state.trendDates}
            />
            <div style={{margin:'20px'}}></div>
            
            <CRow>
            <CCol xs="12" sm="6" lg="6">
            <CDataTable
              items={this.state.scoreChange}
              fields={trend_change_fields}
              size="sm"
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'trend':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.trend)}>
                        {item.trend}
                      </CBadge>
                    </td>
                  )

              }}
            />
            </CCol>
            <CCol xs="12" sm="6" lg="6">
            <CWidgetDropdown
              header="Increase"
              text="Prediction performance of next week"
              color="gradient-success"
              footerSlot={
                <div style={{margin:'20px'}}></div>
              }
            >
            </CWidgetDropdown>
            </CCol>
            </CRow>
          </CCardBody>
      </CCard>
      


      </>
    )
  }
}

export default Restaurant
