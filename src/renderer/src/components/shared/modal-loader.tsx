import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

interface ModalLoaderProps {
  open: boolean;
}

const ModalLoader: React.FC<ModalLoaderProps> = ({ open }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default ModalLoader;
