'use client';

import { ModernAlert } from "#/ui/alerts/modern-alert";
import { Button } from "#/ui/buttons/button";
import { Spinner } from "#/ui/spinner";
import Layout from "#/ui/web/Layout";
import SectionContainer from "#/ui/web/SectionContainer";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from 'yup'
import Image from 'next/image'
import { RoomClass, BacklineClass } from "#/types";
import { useCookies } from "react-cookie";
import PartnerTileGrid from "#/ui/web/PartnerTileGrid";
import BacklineTileGrid from "#/ui/web/BacklineTileGrid";
import { useUser } from "#/lib/useUser";


export default function Page({params}: any) {
  console.log(params, 'params')
  
  const handleSubmit = (values: any) => {
    console.log(values, 'values')
  }
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<RoomClass>()
  const [backlineData, setBacklineData] = useState<BacklineClass[]>([])
  const [dropdown, setDropdown] = useState("hidden")
  const [totalPrice, setTotalPrice] = useState(0)
  const [defaultSelectedRadio, setDefaultSelectedRadio] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['studionest_user','studionest_user_token']);
  const [authenticated, setAuthenticated] = useState(false);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState(0)
  const user = useUser();

  const router = useRouter();
  
  useEffect(() => {
    fetch("/api/auth/user", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.studionest_user_token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail === 'Invalid ID token') {
        } else {
          setAuthenticated(true);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err, 'errrr');
        setLoading(false);
        setAuthenticated(false);

      });
    }, [cookies,cookies.studionest_user_token]);
    useEffect(() => {
      fetch(`/api/admin/rooms/room`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'room-id': params.roomId,
          }
      })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setDefaultSelectedRadio(true)
        setTotalPrice(data.pricePerHour * 2)
      }).then(() => {
        fetch(`/api/admin/backline/backline`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            }
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, 'backlineovic')
          setBacklineData(data);
          setLoading(false);
        });
      })
    }, [params.roomId]);

    console.log(quantity, 'the right place')

    const placeBooking = () => {
      if(authenticated) {
        setLoading(true);
        let selectedBackline = []
        for (const [key, value] of Object.entries(quantity)) {
          if(value != 0) {
            selectedBackline.push({
              id: key,
              quantity: value
            })
          }
        }
        // Find the real backline from the backlineData using selectedBackline id with lambda, no for loops
        let realBackline: any = []
        selectedBackline.forEach((selectedBacklineItem) => {
          backlineData.forEach((backlineDataItem) => {
            if(selectedBacklineItem.id == backlineDataItem._id) {
              realBackline.push({
                quantity: selectedBacklineItem.quantity,
                name: backlineDataItem.name,
                price: backlineDataItem.price,
              })
            }
          })
        })
        


        let body = {
          roomId: params.roomId,
          duration: duration,
          totalPrice: totalPrice,
          dateFrom: "2023-07-30T09:30:00Z",
          booker: {
            email: user.user?.email,
            name: user.user?.name,
            uid: user.user?.uid,
          },
          backline: realBackline

        }
        console.log(body)

        fetch(`/api/booking/createbooking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
          body: JSON.stringify(body)
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          router.push(`/booking/${data._id}`)
          setLoading(false);
        });
      }
    }

    const updateTotalPrice = (e: any) => {
      if(data != undefined) {
        setTotalPrice(data.pricePerHour * e.target.value)
        setDefaultSelectedRadio(false)
        setDuration(e.target.value)
      }
    }
    
    
    if(loading || data == undefined ) {
      return <div className='flex justify-center'><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-50"></div></div>
    }
    console.log(data,' test data tetete')
    return (
      <div>
          <SectionContainer>
            <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2 bg-gray-900 p-8 border-rounded rounded-xl">
              {/* Back button */}
              <Link
                href={`/partners/`}
              >
              
              </Link>

              <div className="flex items-center flex-col">
                <Image alt="neshto" src={data.img} width={1000} height={1000}/>
                <h1 className="h1 max-h-48 mt-2" style={{ marginBottom: 0 }}>
                  {data.name}
                </h1>
              </div>

              <div
                className="bg-scale-300 py-6"
                style={{
                  marginLeft: 'calc(50% - 50vw)',
                  marginRight: 'calc(50% - 50vw)',
                }}
              >
              </div>

              <div className="grid gap-3 space-y-16 lg:grid-cols-4 lg:space-y-0">
                <div className="lg:col-span-3">
                  <h2
                    className="text-scale-1200"
                    style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Backline
                  </h2>
                  <BacklineTileGrid backlines={backlineData} authenticated={authenticated} quantity={quantity} setQuantity={setQuantity}/>
                </div>

                <div>
                  <h2
                    className="text-scale-1200"
                    style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Details
                  </h2>

                  <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">{data.name}</span>
                      {/* <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-900 transition-colors hover:text-brand-800"
                      >
                      </a> */}
                    </div>
                  <div className="divide-y text-scale-1200">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">Category</span>
                      <span className="text-scale-1200">{data.type}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">Location</span>
                      <Link
                        href={`/partners/`}
                      >
                          {data.location}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">Description</span>
                        <span className="flex items-center space-x-1">
                          <span>{data.desc}</span>
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">Price per Hour</span>
                        <span className="flex items-center space-x-1">
                          <span>{data.pricePerHour} EUR</span>
                        </span>
                    </div>
                    <div className="flex items-center flex-col justify-between py-2 relative">
                      <span className="text-scale-900 pb-2">Choose hours</span>
                        <span className="flex items-center space-x-1">
                          <div className="flex">
                              <div className="flex items-center mr-4">
                                  <input onChange={updateTotalPrice} type="radio" value="2" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                  <label htmlFor="inline-radio" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">2</label>
                              </div>
                              <div className="flex items-center mr-4">
                                  <input onChange={updateTotalPrice} type="radio" value="4" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                  <label htmlFor="inline-2-radio" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">4</label>
                              </div>
                              <div className="flex items-center mr-4">
                                  <input onChange={updateTotalPrice} type="radio" value="6" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                  <label htmlFor="inline-2-radio" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">6</label>
                              </div>
                          </div>
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">In total</span>
                        <span className="flex items-center space-x-1">
                          <span>{totalPrice} EUR</span>
                        </span>
                    </div>
                    {authenticated ? (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900"><button onClick={placeBooking} className="bg-gray-400 pl-4 pr-4 pt-1 pb-1 rounded-md border-rounded">Book</button></span>
                    </div>) : null
                      }
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>
        </div>
    )
}