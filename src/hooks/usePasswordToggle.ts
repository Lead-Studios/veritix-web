'use client'

import { useState } from "react";

export default function usePasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return { showPassword, handleClickShowPassword };

}
