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
      hashtag_counts:[],
      scoreChange:{},
      prediction:{},
      prediction_state:{'Average_food_score':['0','0'],
      'Average_env_score':['0','0'],
      'Average_service_score':['0','0'],
      'Average_score':['0','0'],
      'Average_openrice_Eng_and_emoji_score':['0','0']},
      avgScorepre : []

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
      pop_comments: restaurant_info.most_common_hashtags[0],
      prediction: restaurant_info.prediction[0]
    })

    console.log(this.state.info)
    console.log(this.state.trending)
    console.log(this.state.pop_comments)
    console.log(this.state.prediction)
    

    this.dataMassage();

  }
  
  dataMassage = () => {
    let catagories = '';
    let cat = this.state.info.categories;
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
    
    
    let trendScores = {Average_Eng_and_emoji_score : [], 
      Average_env_score : [],
      Average_food_score : [],
      Average_score : [],
      Average_service_score : []
    };

    let trendDates = [];
    this.state.trending.Date_and_Scores.forEach((e,index)=> {
      trendScores.Average_score.push(e.Average_score);
      trendScores.Average_env_score.push(e.Average_env_score);
      trendScores.Average_food_score.push(e.Average_food_score);
      trendScores.Average_Eng_and_emoji_score.push(e.Average_Eng_and_emoji_score);
      trendScores.Average_service_score.push(e.Average_service_score);
      trendDates.push(e.Date.split('T')[0]);
    });

    console.log(trendScores)

    let numbers = [1,3,6,9,12];
    let scoreChange = {Average_Eng_and_emoji_score : [], 
      Average_env_score : [],
      Average_food_score : [],
      Average_score : [],
      Average_service_score : []
    };
    

    let domains = Object.keys(trendScores);

    for (let i = 0; i < domains.length; ++i){
      numbers.forEach((e)=>{
        let week = (e == 1) ? '1 week ago' : e + " weeks ago";
        let percent= ((((trendScores[`${domains[i]}`][trendScores[`${domains[i]}`].length-1]-trendScores[`${domains[i]}`][trendScores[`${domains[i]}`].length-1-e])/trendScores[`${domains[i]}`][trendScores[`${domains[i]}`].length-1-e])*100).toFixed(2));
        let trend = '';
        if(isNaN(percent) || percent == 0) trend = 'neutral';
        else if(percent < 0) trend = 'decrease';
        else if(percent > 0) trend = 'increase';
        
        scoreChange[`${domains[i]}`].push({
          week:week,
          change: (trend == 'neutral') ? '0%' : percent + '%',
          trend:trend
        })
  
      });
    }

  
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


    let prediction_state = {};

    let prediction_keys =["Average_food_score", "Average_env_score", "Average_service_score", "Average_score", "Average_openrice_Eng_and_emoji_score"];


    prediction_keys.forEach((e,index)=> {
      if (this.state.prediction[`${e}`]) {
        prediction_state[`${e}`] = ['Increase','gradient-success'];
      }
      else {
        prediction_state[`${e}`] = [ "Decrease","gradient-danger"];
        
      }
    });

  
    console.log(prediction_state);
    



    this.setState({
      catagories: catagories,
      daominScores: domainScores,
      scores:scores,
      scoreDate: scoreDate,
      trendScores:trendScores,
      trendDates:trendDates,
      highest_score_comment: highest_score_comment,
      hashtag_counts : hashtag_counts,
      scoreChange: scoreChange,
      prediction_state : prediction_state
    })

  
  }

  render() {
    return (
      <>
      
        <CRow>
        <CCol xs="12" sm="6" lg="8">
        <CCard>
          <CCardHeader>
          <h1><strong>{this.state.info.name}</strong></h1>
            {/* <DocsLink name="CTooltip"/> */}
          </CCardHeader>
          <CCardBody>
          <h4><strong>District:</strong> {this.state.info.district}</h4>
          <h4><strong>Price Range:</strong>{this.state.info.priceRange}</h4>
          <h4><strong>Categories:</strong> {this.state.catagories}</h4>
          <h4><strong>Address:</strong></h4> <h5>{this.state.info.address}</h5>
          <h4><strong>Telephone:</strong></h4> <h4>{this.state.info.tel}</h4>
          <a href={this.state.info.url}><strong>Click here to Openrice Link</strong></a>
          
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
            <div style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between'}}>
             <h5>Food:{this.state.highest_score_comment.Average_caption_food_score}</h5>
             <h5>Environment:{this.state.highest_score_comment.Average_caption_env_score}</h5>
             <h5>Service:{this.state.highest_score_comment.Average_caption_service_score}</h5>
             <h5>Emoji:{this.state.highest_score_comment.Average_caption_env_score}</h5>
            </div>
            <div style={{margin:'10px'}}></div>
            <h5>Overall:{this.state.highest_score_comment.Average_caption_score}</h5>
            
           </CCardBody>
           <CCardFooter>
              comment date: {this.state.highest_score_comment.Date}
           </CCardFooter>
        </CCard>
        
        </CCol>
        </CRow>
      
        <CCard>
          <CCardHeader>
            <h3><strong>Average overall Score trending</strong></h3>
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
                  data: this.state.trendScores.Average_score
                }
              ]}
              options={{
                scales: {
                  yAxes: [{
                      ticks: {
                        max: 5,
                        min: 0,
                        stepSize: 1
                      }
                  }]
              },        
                aspectRatio: 7,
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
              items={this.state.scoreChange.Average_score}
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
              header={this.state.prediction_state.Average_score[0]}
              text="Prediction performance of next week"
              color={this.state.prediction_state.Average_score[1]}
              footerSlot={
                <div style={{margin:'20px'}}></div>
              }
            >
            </CWidgetDropdown>
            </CCol>
            </CRow>
          </CCardBody>
      </CCard>

      <CCard>
          <CCardHeader>
            <h3><strong>Average overall Food Score Trending</strong></h3>
          </CCardHeader>
          <CCardBody>
            <CChartLine
              datasets={[
                {
                  label: 'Average overall Food Score Trending',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(102,102,255,0.4)',
                  borderColor: 'rgba(102,102,255,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(102,102,255,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(102,102,255,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.state.trendScores.Average_food_score
                }
              ]}
              options={{
                scales: {
                  yAxes: [{
                      ticks: {
                        max: 5,
                        min: 0,
                        stepSize: 1
                      }
                  }]
              },        
                aspectRatio: 7,
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
              items={this.state.scoreChange.Average_food_score}
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
              header={this.state.prediction_state.Average_food_score[0]}
              text="Prediction performance of next week"
              color={this.state.prediction_state.Average_food_score[1]}
              footerSlot={
                <div style={{margin:'20px'}}></div>
              }
            >
            </CWidgetDropdown>
            </CCol>
            </CRow>
          </CCardBody>
      </CCard>

      <CCard>
          <CCardHeader>
            <h3><strong>Average overall Environemnt Score Trending</strong></h3>
          </CCardHeader>
          <CCardBody>
            <CChartLine
              datasets={[
                {
                  label: 'Average overall Environemnt Score Trending',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(102,178,255,0.4)',
                  borderColor: 'rgba(102,178,255,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(102,178,255,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(102,178,255,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.state.trendScores.Average_env_score
                }
              ]}
              options={{
                scales: {
                  yAxes: [{
                      ticks: {
                        max: 5,
                        min: 0,
                        stepSize: 1
                      }
                  }]
              },        
                aspectRatio: 7,
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
              items={this.state.scoreChange.Average_env_score}
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
              header={this.state.prediction_state.Average_env_score[0]}
              text="Prediction performance of next week"
              color={this.state.prediction_state.Average_env_score[1]}
              footerSlot={
                <div style={{margin:'20px'}}></div>
              }
            >
            </CWidgetDropdown>
            </CCol>
            </CRow>
          </CCardBody>
      </CCard>

      <CCard>
          <CCardHeader>
            <h3><strong>Average overall Service Score Trending</strong></h3>
          </CCardHeader>
          <CCardBody>
            <CChartLine
              datasets={[
                {
                  label: 'Average overall Service Score Trending',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(178,102,255,0.4)',
                  borderColor: 'rgba(178,102,255,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(178,102,255,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(178,102,255,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.state.trendScores.Average_service_score
                }
              ]}
              options={{
                scales: {
                  yAxes: [{
                      ticks: {
                        max: 5,
                        min: 0,
                        stepSize: 1
                      }
                  }]
              },        
                aspectRatio: 7,
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
              items={this.state.scoreChange.Average_service_score}
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
              header={this.state.prediction_state.Average_service_score[0]}
              text="Prediction performance of next week"
              color={this.state.prediction_state.Average_service_score[1]}
              footerSlot={
                <div style={{margin:'20px'}}></div>
              }
            >
            </CWidgetDropdown>
            </CCol>
            </CRow>
          </CCardBody>
      </CCard>

      <CCard>
          <CCardHeader>
            <h3><strong>Average Emoji Count Trending</strong></h3>
          </CCardHeader>
          <CCardBody>
            <CChartLine
              datasets={[
                {
                  label: 'Average Emoji Count Trending',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(255,120,255,0.4)',
                  borderColor: 'rgba(255,120,255,1)',
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'rgba(255,120,255,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'rgba(255,120,255,1)',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.state.trendScores.Average_Eng_and_emoji_score
                }
              ]}
              options={{
                scales: {
                  yAxes: [{
                      ticks: {
                        max: 5,
                        min: 0,
                        stepSize: 1
                      }
                  }]
              },        
                aspectRatio: 7,
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
              items={this.state.scoreChange.Average_Eng_and_emoji_score}
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
              header={this.state.prediction_state.Average_openrice_Eng_and_emoji_score[0]}
              text="Prediction performance of next week"
              color={this.state.prediction_state.Average_openrice_Eng_and_emoji_score[1]}
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
