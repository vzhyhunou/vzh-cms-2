import { useState } from 'react';
import * as router from 'react-router-dom';
import { useFormContext, useWatch } from 'react-hook-form';
import * as admin from 'react-admin';

export default {
  useState,
  ...router,
  useFormContext,
  useWatch,
  ...admin
};
