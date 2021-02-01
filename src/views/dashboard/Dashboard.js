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
  CCallout,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CCollapse
} from '@coreui/react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
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
const fields = ['name','district','catagories',
{
  key: 'show_details',
  label: '',
  _style: { width: '1%' },
  sorter: false,
  filter: false
}]

const hkIslandList = ['kennedy-town','lan-kwai-fong','wan-chai','tin-hau','sai-wan-ho','pok-fu-lam','deep-water-bay','stanley','western-district','sheung-wan','mid-levels','happy-valley','north-point','shau-kei-wan','cyberport','wong-chuk-hang','shek-tong-tsui','central','the-peak','causeway-bay','quarry-bay','heng-fa-chuen','aberdeen','repulse-bay','sai-ying-pun','soho','admiralty','tai-hang','tai-koo','chai-wan','ap-lei-chau','shek-o']
const kowloonList = ['sham-shui-po','yau-ma-tei','hung-hom','kowloon-tong','san-po-kong','kowloon-bay','yau-tong','mei-foo','prince-edward','jordan','ho-man-tin','kowloon-city','diamond-hill','ngau-tau-kok','lei-yue-mun','lai-chi-kok','mong-kok','tsim-sha-tsui','to-kwa-wan','lok-fu','tsz-wan-shan','kwun-tong','cheung-sha-wan','tai-kok-tsui','knutsford-terrace','shek-kip-mei','wong-tai-sin','choi-hung','lam-tin']
const newTerritoriesList = ['ma-on-shan','sheung-shui','kwai-chung','sham-tseng','lau-fau-shan','o-south-coast','tai-wai','tai-po','lo-wu','tsuen-wan','tuen-mun','sai-kung','hang-hau','sha-tin','tai-wo','lok-ma-chau','tsing-yi','yuen-long','tesung-kwan-o','fo-tan','fanling','kwai-fong','ma-wan','tin-shui-wai','po-lam']
const outIslandList = ['lantau-island','lamma-island','discovery-bay','tai-o','po-toi-island','tung-chung','cheung-chau','chek-lap-kok','peng-chau']
const hk_list =['Hong Kong Style']
const chinese_list = ["Sichuan","Taiwan","Guangxi","Village Food","Shanxi (shan)","Huaiyang","Guangdong","Shanghai","Shunde","Northeastern","Fujian","Mongolia","Chiu Chow","Beijing","Yunnan","Shandong","Jiang-Zhe","Shanxi (Jin)","Hakka","Jingchuanhu","Hunan","Xinjiang","Guizhou","Hubei"]
const cantonese_list = ['Guangdong','Chiu Chow','Hakka','Shunde']
const taiwan_list=['Taiwnaese']
const japan_list = ['Japanese']
const korea_list =  ['Korean']
const thai_list = ['Thai']
const asian_list = ['Vietnamese','Philippines','Sri Lanka','Japanese','Indoesian','Burmese','Korean','Singaporean','Indian','Thai','Malaysia','Nepalese']
const italy_list =['Italian']
const french_list =  ['French']
const western_list = ['British','Australian','Russian','Italian','Spanish','Portuguese','Dutch','French','German','Swiss','Austrian','American','Belgian','Irish']
const midEast_list = ['Lebanon','Jewish','Middle Eastern','Moroccan','Greek','Mediterranean','Egyptian','Turkish','African']
const latinAmerican_list =['Peruvian','Mexican','Brazilian','Cuba','Argentinian']
const international_list = ['International']






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

  handleClick(item,index){
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
    console.log(restaurant_info)
    restaurant_info.info.forEach(obj => {
        var catagories = '';
        obj['catagories'].forEach(oobj => {
            catagories = catagories + oobj + '/'
      })
      catagories = catagories.substring(0, catagories.length - 1);
      obj['catagories'] = catagories

    });
    restaurant_info.info.forEach((e,index)=> {
      e.Average_Eng_and_emoji_score = restaurant_info.latest_week_score[index].Date_and_Scores[0].Average_Eng_and_emoji_score;
      e.Average_env_score = restaurant_info.latest_week_score[index].Date_and_Scores[0].Average_env_score;
      e.Average_food_score = restaurant_info.latest_week_score[index].Date_and_Scores[0].Average_food_score;
      e.Average_score = restaurant_info.latest_week_score[index].Date_and_Scores[0].Average_score;
      e.Average_service_score = restaurant_info.latest_week_score[index].Date_and_Scores[0].Average_service_score;
      e.Date = restaurant_info.latest_week_score[index].Date_and_Scores[0].Date.split('T')[0];
      e.Post_count = restaurant_info.latest_week_score[index].Date_and_Scores[0].Post_count;
    })




    //console.log(restaurant_info)

    this.setState({
      restaurant_info: restaurant_info.info,
      filtered_info : restaurant_info.info
    })


    

    console.log(this.state.restaurant_info)


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
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                Restaurants
                
              {/* <CDropdown className="m-1 d-inline-block" style={{float: 'right'}}>
              <CDropdownToggle color="secondary">
                Cuisine
              </CDropdownToggle>
              <CDropdownMenu
                placement="bottom"
                modifiers={[{name: 'flip', enabled: false }]}
              >
                <CDropdownItem header>Choose one cusine </CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(hk_list)}>Hong Kong Style</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(chinese_list)}>Chinese</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(cantonese_list)}>Cantonese</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(taiwan_list)}>Taiwnaese</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(japan_list)}>Japanese</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(korea_list)}>Korean</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(thai_list)}>Thai</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(asian_list)}>Asian</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(italy_list)}>Italian</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(french_list)}>French</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(western_list)}>Western</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(midEast_list)}>Middile Eastern</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(latinAmerican_list)}>Latin American</CDropdownItem>
                <CDropdownItem onClick={() =>this.handleClick(international_list)}>International</CDropdownItem>
              </CDropdownMenu>
              </CDropdown> */}


              {/* <CDropdown className="m-1 d-inline-block" style={{float: 'right'}}>
              <CDropdownToggle color="secondary">
               District
              </CDropdownToggle>
              <CDropdownMenu
                placement="bottom"
                modifiers={[{name: 'flip', enabled: false }]}
              >
                <CDropdownItem header>Hong Kong Island</CDropdownItem>
                <CDropdownItem disabled>Kowloon</CDropdownItem>
                <CDropdownItem>New Territories</CDropdownItem>
                <CDropdownItem>Out Island</CDropdownItem>
              </CDropdownMenu>
              </CDropdown> */}

                {/* <button>a</button> */}
            </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={this.state.filtered_info}
                  fields={fields}
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
                    // 'status':
                    //   (item) => (
                    //     <td>
                    //       <CBadge color={getBadge(item.status)}>
                    //         {item.status}
                    //       </CBadge>
                    //     </td>
                    //   )
                    'show_details':
                    (item, index)=>{
                    return (
                      <td className="py-2">
                        <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={()=>{this.toggleDetails(index)}}
                        >
                         {this.state.details.includes(index) ? 'Hide' : 'Show'}
                         </CButton>
                      </td>
                    )
                    },
                    'details':
                      (item, index)=>{
                       return (
                       <CCollapse show={this.state.details.includes(index)}>
                         <CCardBody>
                           <h4>Scores:</h4>
                           <h5>Food: {item.Average_food_score}</h5>
                           <h5>Environment: {item.Average_env_score}</h5>
                           <h5>Service: {item.Average_service_score}</h5>
                           <h5>Emoji Score: {item.Average_Eng_and_emoji_score}</h5>
                           <h5>Total Score: {item.Average_score}</h5>
                           <p className="text-muted">Update since: {item.Date}</p>
                           <CButton size="sm" color="info">
                              <Link to={`/restaurant/${item.name}`}><strong>Show Details</strong></Link>
                           </CButton>
                         </CCardBody>
                       </CCollapse>
                      )
                    }
                  //   'show_details':
                  //   (item, index)=>{
                      
                  //     return (
                  //       <td className="py-2">
                  //         <CButton
                  //           color="primary"
                  //           variant="outline"
                  //           shape="square"
                  //           size="sm"
                  //           // onClick={() =>this.handleClick(item,index)}
                  //         >
                  //           <Link to={`/restaurant/${item.name}`}><strong>Show Details</strong></Link>
                  //         </CButton>
                  //       </td>
                  //       )
                  //   }

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

