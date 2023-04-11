import { faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './index.css';
import NavBarProfile from './NavBarProfile';
import { CuitAccount, unsetCuitAccount } from '../../store/CuitSlice';
import { useDispatch } from 'react-redux';

const Navbar = ({
  selectedProfile,
  onSelectedProfile,
}: {
  selectedProfile?: CuitAccount;
  onSelectedProfile: (profile: CuitAccount) => void;
}) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch()

  return (
    <div className="navbar-container">
      <span onClick={()=>dispatch(unsetCuitAccount())} className="navbar-title">AFIP - Facturador</span>

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
