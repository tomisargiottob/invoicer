import './index.css';
import Button from '../../Button';
import SecondaryButton from '../../SecondaryButton';
import { useNavigate } from 'react-router-dom';
import Profile from '../../../class/Profile/Profile';
import { useAppSelector } from '../../../store/store';
import { CuitAccount, CuitAccountInput, unsetCuitAccount } from '../../../store/CuitSlice';
import { useDispatch } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';

const NavBarProfile = ({
  setProfileOpen,
  onSelectedProfile,
}: {
  setProfileOpen: Dispatch<SetStateAction<boolean>>
  onSelectedProfile: (profile: CuitAccount) => void;
}) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user)
  const dispatch = useDispatch()
  const onClickNewUser = () => {
    navigate('/newProfile');
  };
  const onClickLogOut = () => {
    localStorage.removeItem("logged_user");
    navigate("/login");
  }

  const handleUserChange = () => {
    dispatch(unsetCuitAccount())
    setProfileOpen(false)
  }

  return (
    <div className="navbar-profile-container">
      <SecondaryButton style={{ padding: 10 }} onClick={handleUserChange}>
        Cambiar de Usuario
      </SecondaryButton>
      {user.cuitAccounts?.map((profile) => (
        <Button
          style={{ padding: 10, width: '100%' }}
          onClick={() => onSelectedProfile(profile)}
          key={profile.fullname}
        >
          {profile.fullname} ({profile.cuit})
        </Button>
      ))}
      <SecondaryButton style={{ padding: 10 }} onClick={onClickNewUser}>
        Agregar Nuevo
      </SecondaryButton>
      <SecondaryButton style={{ padding: 10 }} onClick={onClickLogOut}>
        Cerrar Sesion
      </SecondaryButton>
    </div>
  );
};

export default NavBarProfile;
