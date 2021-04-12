import React, { lazy } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CCollapse,
  CJumbotron
} from '@coreui/react'


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import * as Realm from "realm-web";
const app = new Realm.App({ id: "fyp_api-bhlis" });



const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

//const fields = ['name','district','categories','Last_Week_Avg_Score', 'This_Week_Avg_Score','prediction','most_common_hashtag','total_num_of_posts',
const fields = ['name', 'district', 'categories', 'This_Week_Avg_Score', 'one_Week_change', 'prediction', 'Average_env_score', 'Average_food_score', 'Average_service_score', 'most_common_hashtag', 'total_num_of_posts',
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }]



class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.state = {
      user: [],
      restaurant_info: [],
      filtered_info: [],
      details: []
    };

  }

  handleClick(item, index) {
    console.log(item.name);
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

    restaurant_info.info.forEach(obj => {
      var categories = '';
      obj['categories'].forEach(oobj => {
        categories = categories + oobj + '/'
      })
      categories = categories.substring(0, categories.length - 1);
      obj['categories'] = categories

    });

    var undefined_rest = []
    restaurant_info.info.forEach(function (e, i, o) {
      let nid_tag = e.nid.split('(')[0];
      nid_tag = nid_tag.trim();

      e.total_num_of_posts = e.reviewCount;
      restaurant_info.most_common_hashtags.forEach(k => {
        if (k.OpenRice_Restaurant_name.toString().split('(')[0].trim() === nid_tag) {
          try {
            e.most_common_hashtag = Object.keys(k.Top_Hashtags[0])[0];
          }
          catch {
            e.most_common_hashtag = "null";
          }
          return
        }
      })
      restaurant_info.latest_week_score.forEach(k => {
        if (k.Openrice_Restaurant_Name.toString().split('(')[0].trim() === nid_tag) {
          //          e.Last_Week_Avg_Score = k.Date_and_Scores[0].Average_score;
          e.This_Week_Avg_Score = k.Date_and_Scores[1].Average_score.toFixed(3);
          e.one_Week_change = (k.Date_and_Scores[1].Average_score - k.Date_and_Scores[0].Average_score).toFixed(3);
          e.Average_Eng_and_emoji_score = k.Date_and_Scores[1].Average_Eng_and_emoji_score.toFixed(3);
          e.Average_env_score = k.Date_and_Scores[1].Average_env_score.toFixed(3);
          e.Average_food_score = k.Date_and_Scores[1].Average_food_score.toFixed(3);
          e.Average_score = k.Date_and_Scores[1].Average_score.toFixed(3);
          e.Average_service_score = k.Date_and_Scores[1].Average_service_score.toFixed(3);
          e.Date = k.Date_and_Scores[1].Date.split('T')[0];
          return
        }
      })
      restaurant_info.prediction.forEach(k => {
        if (k.Openrice_Restaurant_Name.toString().split('(')[0].trim() === nid_tag) {
          if (k.Average_score == true) {
            e.prediction = "increase";
          }
          else if (k.Average_score == false) {
            e.prediction = "decrease";
          }
          else {
            e.prediction = "null"
          }
          return
        }
      })

    });

    restaurant_info.info = restaurant_info.info.filter(i => i.This_Week_Avg_Score != null);
    restaurant_info.info = restaurant_info.info.filter(i => i.prediction != null);
    
    console.log(restaurant_info.info)
    this.setState({
      restaurant_info: restaurant_info.info,
      filtered_info: restaurant_info.info
    })
    console.log(this.state.filtered_info)
  }

  toggleDetails(index) {
    const position = this.state.details.indexOf(index);
    let newDetails = this.state.details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...this.state.details, index];
    }
    this.setState({
      details: newDetails
    });
  }


  render() {

    return (
      <>

        <CJumbotron className="border">
          <h1 className="display-3">Welcome to the new restaurant review system</h1>
          <h3 className="lead">In here you can have a peek on the performance of each restaurants.</h3>
          <hr className="my-2" />
          <h3>Below is the dashboard of the restaurants.</h3>
        </CJumbotron>


        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h2>Restaurants</h2>

              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={this.state.filtered_info}
                  fields={fields}
                  sorter
                  hover
                  striped
                  bordered
                  itemsPerPageSelect
                  itemsPerPage={20}
                  columnFilter
                  tableFilter
                  size="sm"
                  itemsPerPage={10}
                  pagination
                  scopedSlots={{
                    'show_details':
                      (item, index) => {
                        return (
                          <td className="py-2">
                            <CButton
                              color="primary"
                              variant="outline"
                              shape="square"
                              size="sm"
                              onClick={() => { this.toggleDetails(index) }}
                            >
                              {this.state.details.includes(index) ? 'Hide' : 'Show'}
                            </CButton>
                          </td>
                        )
                      },
                    'details':
                      (item, index) => {
                        return (
                          <CCollapse show={this.state.details.includes(index)}>
                            <CCardBody>
                              <h4>Scores:</h4>
                              <div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between' }}>
                                <h5>Food: {item.Average_food_score}</h5>
                                <h5>Environment: {item.Average_env_score}</h5>
                                <h5>Service: {item.Average_service_score}</h5>
                                <h5>Emoji Score: {item.Average_Eng_and_emoji_score}</h5>
                                <h5>Total Score: {item.Average_score}</h5>
                              </div>
                              <p className="text-muted">Update since: {item.Date}</p>
                              <CButton size="sm" color="info">
                                <Link to={`/restaurant/${item.nid}`}><strong>Show Details</strong></Link>
                              </CButton>
                            </CCardBody>
                          </CCollapse>
                        )
                      }

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

