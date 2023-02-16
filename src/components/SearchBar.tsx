"use client"

import { useRouter } from 'next/navigation';
import { FormEvent, useRef } from 'react';

export default function NavBar() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    const query = searchRef?.current?.value;
    if (query) {
      router.push(`search/${query}`);
    }
  };

  return (
    <form onSubmit={(e: FormEvent) => submitHandler(e)}>
      <input type='text' ref={searchRef} placeholder="Search" />
      <button type='submit'>Search</button>
    </form>
  )
}
