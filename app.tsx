'use client'

import { useState, useCallback, useEffect } from 'react'
import { Moon, Sun, MoreHorizontal, Calendar, Home, DollarSign, ArrowLeft, Phone, Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm, SubmitHandler } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui"

// Initial mock data for properties
const initialProperties = [
  {
    id: 'PROP001',
    address: '123 Main St, Anytown, USA',
    price: 250000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    description: 'A beautiful family home in a quiet neighborhood.',
    image: '/placeholder.svg?height=400&width=600'
  },
  {
    id: 'PROP002',
    address: '456 Elm St, Somewhere, USA',
    price: 350000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2000,
    description: 'Spacious house with a large backyard and modern amenities.',
    image: '/placeholder.svg?height=400&width=600'
  },
]

// Initial mock data for mortgage offers
const initialMortgageOffers = [
  {
    id: 'MORT001',
    provider: 'Arcanium Bank',
    maxAmount: 500000,
    term: 30,
    interestRate: 3.5,
    totalCollateral: 20,
    initialCollateral: 10,
    walletAddress: '0x1234567890123456789012345678901234567890'
  },
  {
    id: 'MORT002',
    provider: 'Mystic Lenders',
    maxAmount: 750000,
    term: 25,
    interestRate: 3.2,
    totalCollateral: 25,
    initialCollateral: 15,
    walletAddress: '0x0987654321098765432109876543210987654321'
  },
]

// Simulated database
const db = {
  properties: initialProperties,
  mortgageOffers: initialMortgageOffers,
}

// Simulated database operations
const saveToDatabase = (table: 'properties' | 'mortgageOffers', data: any) => {
  db[table] = [...db[table], data]
  return Promise.resolve(data)
}

const getFromDatabase = (table: 'properties' | 'mortgageOffers') => {
  return Promise.resolve(db[table])
}

const deleteFromDatabase = (table: 'properties' | 'mortgageOffers', id: string) => {
  db[table] = db[table].filter((item: any) => item.id !== id)
  return Promise.resolve()
}

export default function ArcaniumApp() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('properties')
  const [properties, setProperties] = useState(initialProperties)
  const [mortgageOffers, setMortgageOffers] = useState(initialMortgageOffers)
  const [showWarning, setShowWarning] = useState(true)

  useEffect(() => {
    // Load data from the database on component mount
    getFromDatabase('properties').then(setProperties)
    getFromDatabase('mortgageOffers').then(setMortgageOffers)
  }, [])

  const handleSubmit = async (formType: string, data: any) => {
    console.log(`${formType} form submitted:`, data)
    if (formType === 'List Property') {
      const newProperty = {
        id: `PROP${properties.length + 1}`.padStart(7, '0'),
        address: data.address,
        price: parseInt(data.price),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        sqft: parseInt(data.sqft),
        description: data.description,
        image: data.images ? URL.createObjectURL(data.images[0]) : '/placeholder.svg'
      }
      await saveToDatabase('properties', newProperty)
      setProperties(await getFromDatabase('properties'))
      setCurrentPage('properties')
    } else if (formType === 'List Mortgage Offer') {
      const newMortgageOffer = {
        id: `MORT${mortgageOffers.length + 1}`.padStart(7, '0'),
        provider: data.name,
        maxAmount: parseInt(data.maxAmount),
        term: parseInt(data.term),
        interestRate: parseFloat(data.interestRate),
        totalCollateral: parseInt(data.totalCollateral),
        initialCollateral: parseInt(data.initialCollateral),
        walletAddress: data.walletAddress
      }
      await saveToDatabase('mortgageOffers', newMortgageOffer)
      setMortgageOffers(await getFromDatabase('mortgageOffers'))
      setCurrentPage('mortgages')
    } else if (formType === 'Buy Now') {
      await deleteFromDatabase('properties', data.propertyId)
      setProperties(await getFromDatabase('properties'))
    } else if (formType === 'Make an Offer') {
      console.log('Make an offer submitted:', data)
    } else if (formType === 'Book a Viewing') {
      console.log('Book a viewing submitted:', data)
    } else if (formType === 'Make Mortgage Offer') {
      console.log('Make Mortgage Offer submitted:', data)
    } else if (formType === 'Contact Mortgage Provider') {
      console.log('Contact Mortgage Provider submitted:', data)
    }
  }

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, setImagePreview: (value: string) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const WarningBox = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Warning</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowWarning(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This is not a live site. It is a concept of how Arcanium plans to work.
        </p>
        <Button onClick={() => setShowWarning(false)} className="w-full">
          Close
        </Button>
      </div>
    </div>
  )

  const PropertiesPage = () => (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Arcanium</h1>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => setCurrentPage('listProperty')}>
            <Home className="mr-2 h-4 w-4" />
            List a Property
          </Button>
          <Button variant="secondary" onClick={() => setCurrentPage('mortgages')}>
            <DollarSign className="mr-2 h-4 w-4" />
            View Mortgages
          </Button>
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-white" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="h-5 w-5 text-white" />
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="bg-white dark:bg-gray-800 overflow-hidden">
            <img src={property.image || "/placeholder.svg"} alt={property.address} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{property.address}</h2>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">${property.price.toLocaleString()}</p>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>{property.bedrooms} beds</span>
                <span>{property.bathrooms} baths</span>
                <span>{property.sqft} sqft</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">ID: {property.id}</p>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-700 p-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <MoreHorizontal className="mr-2 h-4 w-4" /> More Info
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{property.address}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <img src={property.image || "/placeholder.svg"} alt={property.address} className="w-full h-48 object-cover rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Price:</p>
                        <p>${property.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-semibold">ID:</p>
                        <p>{property.id}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Bedrooms:</p>
                        <p>{property.bedrooms}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Bathrooms:</p>
                        <p>{property.bathrooms}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Square Footage:</p>
                        <p>{property.sqft} sqft</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">Description:</p>
                      <p>{property.description}</p>
                    </div>
                    <div className="flex justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Buy Now</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Buy Now</DialogTitle>
                            <DialogDescription>Please fill out the form to proceed with your purchase.</DialogDescription>
                          </DialogHeader>
                          <Form>
                            <form onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(e.currentTarget)
                              handleSubmit('Buy Now', { ...Object.fromEntries(formData), propertyId: property.id })
                            }} className="space-y-4">
                              <div>
                                <Label htmlFor="buyName">Name</Label>
                                <Input id="buyName" name="name" required />
                              </div>
                              <div>
                                <Label htmlFor="buyEmail">Email</Label>
                                <Input id="buyEmail" name="email" type="email" required />
                              </div>
                              <Button type="submit">Confirm Purchase</Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Make an Offer</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Make an Offer</DialogTitle>
                            <DialogDescription>Please fill out the form to make an offer.</DialogDescription>
                          </DialogHeader>
                          <Form>
                            <form onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(e.currentTarget)
                              handleSubmit('Make an Offer', Object.fromEntries(formData))
                            }} className="space-y-4">
                              <div>
                                <Label htmlFor="offerName">Name</Label>
                                <Input id="offerName" name="name" required />
                              </div>
                              <div>
                                <Label htmlFor="offerEmail">Email</Label>
                                <Input id="offerEmail" name="email" type="email" required />
                              </div>
                              <div>
                                <Label htmlFor="offerAmount">Offer Amount</Label>
                                <Input id="offerAmount" name="amount" type="number" required />
                              </div>
                              <Button type="submit">Submit Offer</Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" className="w-full">
                          <Calendar className="mr-2 h-4 w-4" /> Book a Viewing
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book a Viewing</DialogTitle>
                          <DialogDescription>Please fill out the form to book a viewing for {property.address}.</DialogDescription>
                        </DialogHeader>
                        <Form>
                          <form onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            handleSubmit('Book a Viewing', { ...Object.fromEntries(formData), propertyId: property.id })
                          }} className="space-y-4">
                            <div>
                              <Label htmlFor="viewingName">Name</Label>
                              <Input id="viewingName" name="name" required />
                            </div>
                            <div>
                              <Label htmlFor="viewingEmail">Email</Label>
                              <Input id="viewingEmail" name="email" type="email" required />
                            </div>
                            <div>
                              <Label htmlFor="viewingDate">Preferred Date</Label>
                              <Input id="viewingDate" name="date" type="date" required />
                            </div>
                            <div>
                              <Label htmlFor="viewingTime">Preferred Time</Label>
                              <Input id="viewingTime" name="time" type="time" required />
                            </div>
                            <div>
                              <Label htmlFor="viewingMessage">Additional Message (Optional)</Label>
                              <Textarea id="viewingMessage" name="message" />
                            </div>
                            <Button type="submit">Book Viewing</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )

  const ListPropertyPage = () => {
    const [imagePreview, setImagePreview] = useState('/placeholder.svg?height=400&width=600')
    const form = useForm()
    const onSubmit: SubmitHandler<{ name: string; email: string; address: string; price: string; description: string; bedrooms: string; bathrooms: string; sqft: string; images: FileList }> = (data) => {
      handleSubmit('List Property', data)
    }

    return (
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Button variant="ghost" className="text-white" onClick={() => setCurrentPage('properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-white" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="h-5 w-5 text-white" />
          </div>
        </header>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">List a Property</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asking Price</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="sqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Footage</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            field.onChange(e.target.files)
                            handleImageUpload(e, setImagePreview)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview || "/placeholder.svg"} alt="Property Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
                <Button type="submit" className="w-full">List Property</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const MortgageOffersPage = () => {
    const form = useForm()
    const onSubmit: SubmitHandler<{ name: string; email: string; address: string; walletAddress: string; maxAmount: string; interestRate: string; term: string; totalCollateral: string; initialCollateral: string; images: FileList }> = (data) => {
      handleSubmit('List Mortgage Offer', data)
    }
    return (
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Button variant="ghost" className="text-white" onClick={() => setCurrentPage('properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
          <h1 className="text-3xl font-bold text-white">Arcanium Mortgage Offers</h1>
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">List Mortgage Offer</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>List a Mortgage Offer</DialogTitle>
                  <DialogDescription>Please fill out the form to list a new mortgage offer.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Wallet Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Loan Amount</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Rate (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="term"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Term (Years)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalCollateral"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Collateral (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="initialCollateral"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Collateral (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload ID Pictures</FormLabel>
                          <FormControl>
                            <Input {...field} type="file" multiple accept="image/*" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">List Offer</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-white" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className="h-5 w-5 text-white" />
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mortgageOffers.map((offer) => (
            <Card key={offer.id} className="bg-white dark:bg-gray-800 overflow-hidden">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{offer.provider}</h2>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  Up to ${offer.maxAmount.toLocaleString()}
                </p>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p>Term: {offer.term} years</p>
                  <p>Interest Rate: {offer.interestRate}%</p>
                  <p>Total Collateral: {offer.totalCollateral}%</p>
                  <p>Initial Collateral: {offer.initialCollateral}%</p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-700 p-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MoreHorizontal className="mr-2 h-4 w-4" /> More Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{offer.provider} Mortgage Offer</DialogTitle>
                      <DialogDescription>
                        Wallet Address: {offer.walletAddress}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Make an Offer</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Make an Offer</DialogTitle>
                            <DialogDescription>Please fill out the form to make an offer.</DialogDescription>
                          </DialogHeader>
                          <Form>
                            <form onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(e.currentTarget)
                              handleSubmit('Make Mortgage Offer', Object.fromEntries(formData))
                            }} className="space-y-4">
                              <div>
                                <Label htmlFor="offerName">Name</Label>
                                <Input id="offerName" name="name" required />
                              </div>
                              <div>
                                <Label htmlFor="offerEmail">Email</Label>
                                <Input id="offerEmail" name="email" type="email" required />
                              </div>
                              <div>
                                <Label htmlFor="offerAmount">Loan Amount</Label>
                                <Input id="offerAmount" name="amount" type="number" max={offer.maxAmount} required />
                              </div>
                              <div>
                                <Label htmlFor="offerPropertyId">Property ID</Label>
                                <Input id="offerPropertyId" name="propertyId" required />
                              </div>
                              <Button type="submit">Submit Offer</Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Phone className="mr-2 h-4 w-4" />
                            Contact Provider
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Contact Provider</DialogTitle>
                            <DialogDescription>Send a message to the mortgage provider.</DialogDescription>
                          </DialogHeader>
                          <Form>
                            <form onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(e.currentTarget)
                              handleSubmit('Contact Mortgage Provider', Object.fromEntries(formData))
                            }} className="space-y-4">
                              <div>
                                <Label htmlFor="contactName">Name</Label>
                                <Input id="contactName" name="name" required />
                              </div>
                              <div>
                                <Label htmlFor="contactEmail">Email</Label>
                                <Input id="contactEmail" name="email" type="email" required />
                              </div>
                              <div>
                                <Label htmlFor="contactMessage">Message</Label>
                                <Textarea id="contactMessage" name="message" required />
                              </div>
                              <Button type="submit">Send Message</Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 min-h-screen p-8">
        {showWarning && <WarningBox />}
        {currentPage === 'properties' && <PropertiesPage />}
        {currentPage === 'listProperty' && <ListPropertyPage />}
        {currentPage === 'mortgages' && <MortgageOffersPage />}
      </div>
    </div>
  )
}
