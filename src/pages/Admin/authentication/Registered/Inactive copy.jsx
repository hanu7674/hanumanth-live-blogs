import React from 'react';
import { IconButton } from 'rsuite';
import ArrowLeftLine from '@rsuite/icons/ArrowLeftLine';
import UserStatusError from '../../../../components/ErrorPage/UserStatus';

export default () => (
  <UserStatusError code={''}>
    <p className="error-page-title">Oops… You just found an error page</p>
    <p className="error-page-subtitle text-muted ">This page is being updated and maintained.</p>
    <IconButton icon={<ArrowLeftLine />} appearance="primary" href="/">
      Take me home
    </IconButton>
  </UserStatusError>
);
