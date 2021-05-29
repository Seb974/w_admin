import React, { useEffect, useState } from 'react';
import FarmActions from '../../../services/FarmActions'
import { CBadge, CCard, CCardBody, CCardHeader, CCol, CDataTable, CRow, CButton } from '@coreui/react';
import { DocsLink } from 'src/reusable'
import { Link } from 'react-router-dom';
import { isDefined } from 'src/helpers/utils';

const Farms = (props) => {

    const itemsPerPage = 15;
    const fields = ['name', 'city', ' '];
    const [farms, setFarm] = useState([]);

    useEffect(() => {
        FarmActions.findAll()
            .then(response => {
                setFarm(response);
            })
            .catch(error => console.log(error));
    }, []);

    const handleDelete = (id) => {
        const originalFarms = [...farms];
        setFarm(farms.filter(farm => farm.id !== id));
        FarmActions.delete(id)
                   .catch(error => {
                        setFarm(originalFarms);
                        console.log(error.response);
                   });
    }

    return (
        <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
                Liste des fermes de minage
                <CCol col="6" sm="4" md="2" className="ml-auto">
                    <Link role="button" to="/components/farms/new" block variant="outline" color="success">CRÉER</Link>
                </CCol>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={ farms }
              fields={ fields }
              bordered
              itemsPerPage={ itemsPerPage }
              pagination
              scopedSlots = {{
                'name':
                  item => <td><Link to={ "/components/farms/" + item.id }>{ item.name }</Link></td>
                ,
                'city':
                  item => <td>{ item.city }</td>
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
 
export default Farms;