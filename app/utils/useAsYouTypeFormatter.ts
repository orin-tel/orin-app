import { useEffect, useRef } from "react"
import { AsYouTypeFormatter } from "google-libphonenumber"

export function useAsYouTypeFormatter(
  value: string,
  setValue: (val: string) => void,
  countryCode: string,
) {
  const formatterRef = useRef<AsYouTypeFormatter | null>(null)
  const prevValueRef = useRef(value)

  // Reinitialize formatter when country code changes
  useEffect(() => {
    formatterRef.current = new AsYouTypeFormatter(countryCode)

    // Reformat the value when country changes
    const formatted = reformatWithNewFormatter(value)

    // Only update if the formatted value is different from the current value
    if (formatted !== value) {
      setValue(formatted)
    }

    prevValueRef.current = value
  }, [countryCode])

  // Only format the new input if the value has changed
  useEffect(() => {
    const rawDigits = value.replace(/\D/g, "")
    const prevRawDigits = prevValueRef.current.replace(/\D/g, "")

    // If the value is cleared, reset the formatter
    if (value === "") {
      formatterRef.current?.clear()
      setValue("")
      prevValueRef.current = ""
      return
    }

    // If no change in the raw digits, do nothing
    if (rawDigits === prevRawDigits) return

    // Format the new part of the string
    if (formatterRef.current) {
      let result = ""
      for (let i = prevRawDigits.length; i < rawDigits.length; i++) {
        result = formatterRef.current.inputDigit(rawDigits[i])
      }

      // Only update the value if the formatted value is different from the current one
      if (result !== value) {
        setValue(result)
      }
    }

    prevValueRef.current = value // Update the previous value for the next comparison
  }, [value])

  function reformatWithNewFormatter(input: string): string {
    if (!formatterRef.current) return input

    // Only clear if the input is entirely empty
    if (input === "") {
      formatterRef.current.clear()
    }

    const rawDigits = input.replace(/\D/g, "")
    let result = ""

    for (const digit of rawDigits) {
      result = formatterRef.current.inputDigit(digit)
    }

    return result
  }
}
