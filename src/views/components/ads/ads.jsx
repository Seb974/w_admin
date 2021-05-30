import React, { useEffect, useState } from 'react';
import AdActions from '../../../services/AdActions'
import { CBadge, CCard, CCardBody, CCardHeader, CCol, CDataTable, CRow, CButton } from '@coreui/react';
import { DocsLink } from 'src/reusable'
import { Link } from 'react-router-dom';
import { isDefined } from 'src/helpers/utils';

const Ads = (props) => {

    const itemsPerPage = 15;
    const fields = ['ferme', 'reste', ' '];
    const [ads, setAd] = useState([]);

    useEffect(() => {
        AdActions.findAll()
            .then(response => {
                setAd(response);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = (id) => {
        const originalAds = [...ads];
        setAd(ads.filter(ad => ad.id !== id));
        AdActions.delete(id)
                   .catch(error => {
                        setAd(originalAds);
                        console.log(error.response);
                   });
    }

    return (
        <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
                Liste des publicités
                <CCol col="6" sm="4" md="2" className="ml-auto">
                    <Link role="button" to="/components/ads/new" block variant="outline" color="success">CRÉER</Link>
                </CCol>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={ ads }
              fields={ fields }
              bordered
              itemsPerPage={ itemsPerPage }
              pagination
              scopedSlots = {{
                'ferme':
                  item => <td><Link to={ "/components/ads/" + item.id }>{ item.farm.name }</Link></td>
                ,
                'reste':
                  item => <td>{ item.usageLimit - item.used }</td>
                ,
                ' ':
                  item =><td><CButton block color="danger" onClick={ () => handleDelete(item.id) }>Supprimer</CButton></td>
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>

      </CRow>
    );
}
 
export default Ads;