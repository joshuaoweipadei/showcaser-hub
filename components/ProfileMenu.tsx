"use client"

import { useRef, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import { SessionInterface } from "@/common.types";

const ProfileMenu = ({ session }: { session: SessionInterface }) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event: { target: any; }) => {
      if(menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenModal(false);
      }
    };

    document.addEventListener('click', closeMenuOnOutsideClick);

    return () => {
      document.removeEventListener('click', closeMenuOnOutsideClick);
    };
  }, []);

  return (
    <div className="flexCenter z-10 flex-col relative" ref={menuRef}>
      <Menu as="div">
        <Menu.Button className="flexCenter" onClick={() => setOpenModal((prev) => !prev)} >
          {session?.user?.image && (
            <Image
              src={session.user.image}
              width={44}
              height={44}
              className="rounded-full"
              alt="user profile image"
            />
          )}
        </Menu.Button>

        <Transition
          show={openModal}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="flexStart profile_menu-items"
            onMouseLeave={() => setOpenModal(false)}
          >
            <div className="flex flex-col items-center gap-y-4">
              {session?.user?.image && (
                <Image
                  src={session?.user?.image}
                  className="rounded-full"
                  width={80}
                  height={80}
                  alt="profile Image"
                />
              )}
              <p className="font-semibold">{session?.user?.name}</p>
            </div>

            <div className="flex flex-col gap-3 pt-7 items-start w-full">
              <Menu.Item>
                <Link href={`/profile/${session?.user?.id}`} className="text-sm">Profile</Link>
              </Menu.Item>
            </div>
              <div className="w-full flexStart border-t border-nav-border mt-5 pt-5">
                <Menu.Item>
                  <button type="button" className="text-sm text-red-500" onClick={() => signOut()}> 
                    Sign out
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ProfileMenu