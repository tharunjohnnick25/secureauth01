"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/ui/icons"
import { toast } from "@/hooks/use-toast"

const generalSettingsSchema = z.object({
  theme: z.string(),
  language: z.string(),
  timezone: z.string(),
})

export function GeneralSettings() {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      theme: "dark",
      language: "en",
      timezone: "UTC",
    },
  })

  async function onSubmit(data: z.infer<typeof generalSettingsSchema>) {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    
    toast({
      title: "Settings updated",
      description: "Your general preferences have been saved successfully.",
    })
  }

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">General Preferences</CardTitle>
        <CardDescription className="text-zinc-400">
          Configure how the platform looks and feels to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Default Theme</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="dark">Secure Dark Mode</SelectItem>
                      <SelectItem value="light">System Light Mode</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">System Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="es">Spanish (ES)</SelectItem>
                      <SelectItem value="de">German (DE)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Time Zone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="UTC">UTC (Greenwich Mean Time)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
