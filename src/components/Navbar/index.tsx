import { faCircleQuestion , faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './index.css';
import NavBarProfile from './NavBarProfile';
import { CuitAccount, unsetCuitAccount } from '../../store/CuitSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Navbar = ({
  selectedProfile,
  onSelectedProfile,
}: {
  selectedProfile?: CuitAccount;
  onSelectedProfile: (profile: CuitAccount) => void;
}) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="navbar-container">
      <span onClick={()=>dispatch(unsetCuitAccount())} className="navbar-title">AFIP - Facturador</span>
      <div className="navbar-options">
        <div className="instructions-container" onClick={()=> navigate('/instructions')}>
          <span>Instrucciones</span>
          <FontAwesomeIcon className="navbar-question-icon" icon={faCircleQuestion} />
        </div>
        <div
          className="navbar-user-container"
          onClick={() => setProfileOpen(!isProfileOpen)}
          aria-hidden="true"
        >
          <div className="navbar-user-info">
            <span>{selectedProfile?.fullname || 'No seleccionado'}</span>
            <span className="navbar-user-info-cuit">
              ({selectedProfile?.cuit || 'No seleccionado'})
            </span>
          </div>
          <FontAwesomeIcon className="navbar-user-icon" icon={faUser} />
        </div>
      </div>
      {isProfileOpen && (
        <>
        <div className='modal-backdrop' onClick={() => setProfileOpen(false)}></div>
        <NavBarProfile
          setProfileOpen={setProfileOpen}
          onSelectedProfile={(profile) => {
            onSelectedProfile(profile);
            setProfileOpen(false);
          }}
        />
        </>
      )}
    </div>
  );
};

export default Navbar;
