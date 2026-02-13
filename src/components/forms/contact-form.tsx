"use client";

import { twMerge } from "tailwind-merge";
import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FORMSPREE_ENDPOINT } from "@/lib/constants";

// ── Shared types ─────────────────────────────────────────────────────

interface FormData {
  email: string;
  name: string;
  phone: string;
  countryCode: string;
  experience: string;
  certification: "Yes" | "No";
  organization: string;
  state: string;
  course?: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  phone?: string;
  organization?: string;
  state?: string;
  submit?: string;
}

const EXPERIENCES = [
  "Student",
  "Fresher / 0 years",
  "1 year",
  "1-2 year",
  "2-3 year",
  "3-5 year",
  "5-8 year",
  "8+ years",
] as const;

const ALL_COUNTRY_CODES = [
  { name: "Afghanistan", dial_code: "+93", code: "AF" },
  { name: "Albania", dial_code: "+355", code: "AL" },
  { name: "Algeria", dial_code: "+213", code: "DZ" },
  { name: "American Samoa", dial_code: "+1-684", code: "AS" },
  { name: "Andorra", dial_code: "+376", code: "AD" },
  { name: "Angola", dial_code: "+244", code: "AO" },
  { name: "Anguilla", dial_code: "+1-264", code: "AI" },
  { name: "Antarctica", dial_code: "+672", code: "AQ" },
  { name: "Antigua and Barbuda", dial_code: "+1-268", code: "AG" },
  { name: "Argentina", dial_code: "+54", code: "AR" },
  { name: "Armenia", dial_code: "+374", code: "AM" },
  { name: "Aruba", dial_code: "+297", code: "AW" },
  { name: "Australia", dial_code: "+61", code: "AU" },
  { name: "Austria", dial_code: "+43", code: "AT" },
  { name: "Azerbaijan", dial_code: "+994", code: "AZ" },
  { name: "Bahamas", dial_code: "+1-242", code: "BS" },
  { name: "Bahrain", dial_code: "+973", code: "BH" },
  { name: "Bangladesh", dial_code: "+880", code: "BD" },
  { name: "Barbados", dial_code: "+1-246", code: "BB" },
  { name: "Belarus", dial_code: "+375", code: "BY" },
  { name: "Belgium", dial_code: "+32", code: "BE" },
  { name: "Belize", dial_code: "+501", code: "BZ" },
  { name: "Benin", dial_code: "+229", code: "BJ" },
  { name: "Bermuda", dial_code: "+1-441", code: "BM" },
  { name: "Bhutan", dial_code: "+975", code: "BT" },
  { name: "Bolivia", dial_code: "+591", code: "BO" },
  { name: "Bosnia and Herzegovina", dial_code: "+387", code: "BA" },
  { name: "Botswana", dial_code: "+267", code: "BW" },
  { name: "Brazil", dial_code: "+55", code: "BR" },
  { name: "British Indian Ocean Territory", dial_code: "+246", code: "IO" },
  { name: "British Virgin Islands", dial_code: "+1-284", code: "VG" },
  { name: "Brunei", dial_code: "+673", code: "BN" },
  { name: "Bulgaria", dial_code: "+359", code: "BG" },
  { name: "Burkina Faso", dial_code: "+226", code: "BF" },
  { name: "Burundi", dial_code: "+257", code: "BI" },
  { name: "Cambodia", dial_code: "+855", code: "KH" },
  { name: "Cameroon", dial_code: "+237", code: "CM" },
  { name: "Canada", dial_code: "+1", code: "CA" },
  { name: "Cape Verde", dial_code: "+238", code: "CV" },
  { name: "Cayman Islands", dial_code: "+1-345", code: "KY" },
  { name: "Central African Republic", dial_code: "+236", code: "CF" },
  { name: "Chad", dial_code: "+235", code: "TD" },
  { name: "Chile", dial_code: "+56", code: "CL" },
  { name: "China", dial_code: "+86", code: "CN" },
  { name: "Christmas Island", dial_code: "+61", code: "CX" },
  { name: "Cocos Islands", dial_code: "+61", code: "CC" },
  { name: "Colombia", dial_code: "+57", code: "CO" },
  { name: "Comoros", dial_code: "+269", code: "KM" },
  { name: "Cook Islands", dial_code: "+682", code: "CK" },
  { name: "Costa Rica", dial_code: "+506", code: "CR" },
  { name: "Croatia", dial_code: "+385", code: "HR" },
  { name: "Cuba", dial_code: "+53", code: "CU" },
  { name: "Curacao", dial_code: "+599", code: "CW" },
  { name: "Cyprus", dial_code: "+357", code: "CY" },
  { name: "Czech Republic", dial_code: "+420", code: "CZ" },
  { name: "Democratic Republic of the Congo", dial_code: "+243", code: "CD" },
  { name: "Denmark", dial_code: "+45", code: "DK" },
  { name: "Djibouti", dial_code: "+253", code: "DJ" },
  { name: "Dominica", dial_code: "+1-767", code: "DM" },
  { name: "Dominican Republic", dial_code: "+1-809, 1-829, 1-849", code: "DO" },
  { name: "East Timor", dial_code: "+670", code: "TL" },
  { name: "Ecuador", dial_code: "+593", code: "EC" },
  { name: "Egypt", dial_code: "+20", code: "EG" },
  { name: "El Salvador", dial_code: "+503", code: "SV" },
  { name: "Equatorial Guinea", dial_code: "+240", code: "GQ" },
  { name: "Eritrea", dial_code: "+291", code: "ER" },
  { name: "Estonia", dial_code: "+372", code: "EE" },
  { name: "Ethiopia", dial_code: "+251", code: "ET" },
  { name: "Falkland Islands", dial_code: "+500", code: "FK" },
  { name: "Faroe Islands", dial_code: "+298", code: "FO" },
  { name: "Fiji", dial_code: "+679", code: "FJ" },
  { name: "Finland", dial_code: "+358", code: "FI" },
  { name: "France", dial_code: "+33", code: "FR" },
  { name: "French Polynesia", dial_code: "+689", code: "PF" },
  { name: "Gabon", dial_code: "+241", code: "GA" },
  { name: "Gambia", dial_code: "+220", code: "GM" },
  { name: "Georgia", dial_code: "+995", code: "GE" },
  { name: "Germany", dial_code: "+49", code: "DE" },
  { name: "Ghana", dial_code: "+233", code: "GH" },
  { name: "Gibraltar", dial_code: "+350", code: "GI" },
  { name: "Greece", dial_code: "+30", code: "GR" },
  { name: "Greenland", dial_code: "+299", code: "GL" },
  { name: "Grenada", dial_code: "+1-473", code: "GD" },
  { name: "Guam", dial_code: "+1-671", code: "GU" },
  { name: "Guatemala", dial_code: "+502", code: "GT" },
  { name: "Guernsey", dial_code: "+44-1481", code: "GG" },
  { name: "Guinea", dial_code: "+224", code: "GN" },
  { name: "Guinea-Bissau", dial_code: "+245", code: "GW" },
  { name: "Guyana", dial_code: "+592", code: "GY" },
  { name: "Haiti", dial_code: "+509", code: "HT" },
  { name: "Honduras", dial_code: "+504", code: "HN" },
  { name: "Hong Kong", dial_code: "+852", code: "HK" },
  { name: "Hungary", dial_code: "+36", code: "HU" },
  { name: "Iceland", dial_code: "+354", code: "IS" },
  { name: "India", dial_code: "+91", code: "IN" },
  { name: "Indonesia", dial_code: "+62", code: "ID" },
  { name: "Iran", dial_code: "+98", code: "IR" },
  { name: "Iraq", dial_code: "+964", code: "IQ" },
  { name: "Ireland", dial_code: "+353", code: "IE" },
  { name: "Isle of Man", dial_code: "+44-1624", code: "IM" },
  { name: "Israel", dial_code: "+972", code: "IL" },
  { name: "Italy", dial_code: "+39", code: "IT" },
  { name: "Ivory Coast", dial_code: "+225", code: "CI" },
  { name: "Jamaica", dial_code: "+1-876", code: "JM" },
  { name: "Japan", dial_code: "+81", code: "JP" },
  { name: "Jersey", dial_code: "+44-1534", code: "JE" },
  { name: "Jordan", dial_code: "+962", code: "JO" },
  { name: "Kazakhstan", dial_code: "+7", code: "KZ" },
  { name: "Kenya", dial_code: "+254", code: "KE" },
  { name: "Kiribati", dial_code: "+686", code: "KI" },
  { name: "Kosovo", dial_code: "+383", code: "XK" },
  { name: "Kuwait", dial_code: "+965", code: "KW" },
  { name: "Kyrgyzstan", dial_code: "+996", code: "KG" },
  { name: "Laos", dial_code: "+856", code: "LA" },
  { name: "Latvia", dial_code: "+371", code: "LV" },
  { name: "Lebanon", dial_code: "+961", code: "LB" },
  { name: "Lesotho", dial_code: "+266", code: "LS" },
  { name: "Liberia", dial_code: "+231", code: "LR" },
  { name: "Libya", dial_code: "+218", code: "LY" },
  { name: "Liechtenstein", dial_code: "+423", code: "LI" },
  { name: "Lithuania", dial_code: "+370", code: "LT" },
  { name: "Luxembourg", dial_code: "+352", code: "LU" },
  { name: "Macau", dial_code: "+853", code: "MO" },
  { name: "Macedonia", dial_code: "+389", code: "MK" },
  { name: "Madagascar", dial_code: "+261", code: "MG" },
  { name: "Malawi", dial_code: "+265", code: "MW" },
  { name: "Malaysia", dial_code: "+60", code: "MY" },
  { name: "Maldives", dial_code: "+960", code: "MV" },
  { name: "Mali", dial_code: "+223", code: "ML" },
  { name: "Malta", dial_code: "+356", code: "MT" },
  { name: "Marshall Islands", dial_code: "+692", code: "MH" },
  { name: "Mauritania", dial_code: "+222", code: "MR" },
  { name: "Mauritius", dial_code: "+230", code: "MU" },
  { name: "Mayotte", dial_code: "+262", code: "YT" },
  { name: "Mexico", dial_code: "+52", code: "MX" },
  { name: "Micronesia", dial_code: "+691", code: "FM" },
  { name: "Moldova", dial_code: "+373", code: "MD" },
  { name: "Monaco", dial_code: "+377", code: "MC" },
  { name: "Mongolia", dial_code: "+976", code: "MN" },
  { name: "Montenegro", dial_code: "+382", code: "ME" },
  { name: "Montserrat", dial_code: "+1-664", code: "MS" },
  { name: "Morocco", dial_code: "+212", code: "MA" },
  { name: "Mozambique", dial_code: "+258", code: "MZ" },
  { name: "Myanmar", dial_code: "+95", code: "MM" },
  { name: "Namibia", dial_code: "+264", code: "NA" },
  { name: "Nauru", dial_code: "+674", code: "NR" },
  { name: "Nepal", dial_code: "+977", code: "NP" },
  { name: "Netherlands", dial_code: "+31", code: "NL" },
  { name: "Netherlands Antilles", dial_code: "+599", code: "AN" },
  { name: "New Caledonia", dial_code: "+687", code: "NC" },
  { name: "New Zealand", dial_code: "+64", code: "NZ" },
  { name: "Nicaragua", dial_code: "+505", code: "NI" },
  { name: "Niger", dial_code: "+227", code: "NE" },
  { name: "Nigeria", dial_code: "+234", code: "NG" },
  { name: "Niue", dial_code: "+683", code: "NU" },
  { name: "North Korea", dial_code: "+850", code: "KP" },
  { name: "Northern Mariana Islands", dial_code: "+1-670", code: "MP" },
  { name: "Norway", dial_code: "+47", code: "NO" },
  { name: "Oman", dial_code: "+968", code: "OM" },
  { name: "Pakistan", dial_code: "+92", code: "PK" },
  { name: "Palau", dial_code: "+680", code: "PW" },
  { name: "Palestine", dial_code: "+970", code: "PS" },
  { name: "Panama", dial_code: "+507", code: "PA" },
  { name: "Papua New Guinea", dial_code: "+675", code: "PG" },
  { name: "Paraguay", dial_code: "+595", code: "PY" },
  { name: "Peru", dial_code: "+51", code: "PE" },
  { name: "Philippines", dial_code: "+63", code: "PH" },
  { name: "Pitcairn", dial_code: "+64", code: "PN" },
  { name: "Poland", dial_code: "+48", code: "PL" },
  { name: "Portugal", dial_code: "+351", code: "PT" },
  { name: "Puerto Rico", dial_code: "+1-787, 1-939", code: "PR" },
  { name: "Qatar", dial_code: "+974", code: "QA" },
  { name: "Republic of the Congo", dial_code: "+242", code: "CG" },
  { name: "Reunion", dial_code: "+262", code: "RE" },
  { name: "Romania", dial_code: "+40", code: "RO" },
  { name: "Russia", dial_code: "+7", code: "RU" },
  { name: "Rwanda", dial_code: "+250", code: "RW" },
  { name: "Saint Barthelemy", dial_code: "+590", code: "BL" },
  { name: "Saint Helena", dial_code: "+290", code: "SH" },
  { name: "Saint Kitts and Nevis", dial_code: "+1-869", code: "KN" },
  { name: "Saint Lucia", dial_code: "+1-758", code: "LC" },
  { name: "Saint Martin", dial_code: "+590", code: "MF" },
  { name: "Saint Pierre and Miquelon", dial_code: "+508", code: "PM" },
  { name: "Saint Vincent and the Grenadines", dial_code: "+1-784", code: "VC" },
  { name: "Samoa", dial_code: "+685", code: "WS" },
  { name: "San Marino", dial_code: "+378", code: "SM" },
  { name: "Sao Tome and Principe", dial_code: "+239", code: "ST" },
  { name: "Saudi Arabia", dial_code: "+966", code: "SA" },
  { name: "Senegal", dial_code: "+221", code: "SN" },
  { name: "Serbia", dial_code: "+381", code: "RS" },
  { name: "Seychelles", dial_code: "+248", code: "SC" },
  { name: "Sierra Leone", dial_code: "+232", code: "SL" },
  { name: "Singapore", dial_code: "+65", code: "SG" },
  { name: "Sint Maarten", dial_code: "+1-721", code: "SX" },
  { name: "Slovakia", dial_code: "+421", code: "SK" },
  { name: "Slovenia", dial_code: "+386", code: "SI" },
  { name: "Solomon Islands", dial_code: "+677", code: "SB" },
  { name: "Somalia", dial_code: "+252", code: "SO" },
  { name: "South Africa", dial_code: "+27", code: "ZA" },
  { name: "South Korea", dial_code: "+82", code: "KR" },
  { name: "South Sudan", dial_code: "+211", code: "SS" },
  { name: "Spain", dial_code: "+34", code: "ES" },
  { name: "Sri Lanka", dial_code: "+94", code: "LK" },
  { name: "Sudan", dial_code: "+249", code: "SD" },
  { name: "Suriname", dial_code: "+597", code: "SR" },
  { name: "Svalbard and Jan Mayen", dial_code: "+47", code: "SJ" },
  { name: "Swaziland", dial_code: "+268", code: "SZ" },
  { name: "Sweden", dial_code: "+46", code: "SE" },
  { name: "Switzerland", dial_code: "+41", code: "CH" },
  { name: "Syria", dial_code: "+963", code: "SY" },
  { name: "Taiwan", dial_code: "+886", code: "TW" },
  { name: "Tajikistan", dial_code: "+992", code: "TJ" },
  { name: "Tanzania", dial_code: "+255", code: "TZ" },
  { name: "Thailand", dial_code: "+66", code: "TH" },
  { name: "Togo", dial_code: "+228", code: "TG" },
  { name: "Tokelau", dial_code: "+690", code: "TK" },
  { name: "Tonga", dial_code: "+676", code: "TO" },
  { name: "Trinidad and Tobago", dial_code: "+1-868", code: "TT" },
  { name: "Tunisia", dial_code: "+216", code: "TN" },
  { name: "Turkey", dial_code: "+90", code: "TR" },
  { name: "Turkmenistan", dial_code: "+993", code: "TM" },
  { name: "Turks and Caicos Islands", dial_code: "+1-649", code: "TC" },
  { name: "Tuvalu", dial_code: "+688", code: "TV" },
  { name: "U.S. Virgin Islands", dial_code: "+1-340", code: "VI" },
  { name: "Uganda", dial_code: "+256", code: "UG" },
  { name: "Ukraine", dial_code: "+380", code: "UA" },
  { name: "United Arab Emirates", dial_code: "+971", code: "AE" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
  { name: "United States", dial_code: "+1", code: "US" },
  { name: "Uruguay", dial_code: "+598", code: "UY" },
  { name: "Uzbekistan", dial_code: "+998", code: "UZ" },
  { name: "Vanuatu", dial_code: "+678", code: "VU" },
  { name: "Vatican", dial_code: "+379", code: "VA" },
  { name: "Venezuela", dial_code: "+58", code: "VE" },
  { name: "Viet Nam", dial_code: "+84", code: "VN" },
  { name: "Virgin Islands, British", dial_code: "+1-284", code: "VG" },
  { name: "Virgin Islands, U.S.", dial_code: "+1-340", code: "VI" },
  { name: "Wallis and Futuna", dial_code: "+681", code: "WF" },
  { name: "Western Sahara", dial_code: "+212", code: "EH" },
  { name: "Yemen", dial_code: "+967", code: "YE" },
  { name: "Zambia", dial_code: "+260", code: "ZM" },
  { name: "Zimbabwe", dial_code: "+263", code: "ZW" },
] as const;

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

const DEFAULT_STATE: FormData = {
  email: "",
  name: "",
  phone: "",
  countryCode: "IN",
  experience: "Student",
  certification: "No",
  organization: "",
  state: "",
};

// ── Custom Dropdown Component ───────────────────────────────────────

interface OptionItem {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly (string | OptionItem)[];
  placeholder?: string;
  error?: string;
  showSearch?: boolean;
}

function CustomSelect({ value, onChange, options, placeholder = "Select...", showSearch = true }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to object format
  const normalizedOptions: OptionItem[] = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );

  const filteredOptions = showSearch
    ? normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  const selectedOption = normalizedOptions.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (showSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showSearch]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm text-left flex items-center justify-between",
          !value && "text-gray-400"
        )}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={twMerge(
            "w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 left-0 min-w-[200px]">
          {/* Search Input */}
          {showSearch && (
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={twMerge(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-primary/5 flex items-center justify-between group",
                    value === option.value && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <span className="truncate pr-2">{option.label}</span>
                  {value === option.value && (
                    <svg
                      className="w-4 h-4 text-primary flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared validation ────────────────────────────────────────────────

function validateForm(formData: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!formData.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email))
    errors.email = "Please enter a valid email";
  if (!formData.name.trim()) errors.name = "Name is required";
  if (!formData.phone)
    errors.phone = "Phone number is required";
  else if (formData.phone.length < 6)
    errors.phone = "Phone number is too short";
  if (!formData.organization.trim())
    errors.organization = "College/Company is required";
  if (!formData.state.trim()) errors.state = "State is required";
  return errors;
}

// ── Shared form hook ─────────────────────────────────────────────────

function useContactForm(modalId: string) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const reset = () => {
    setErrors({});
    setFormData(DEFAULT_STATE);
  };

  const openModal = (courseName?: string) => {
    reset();
    setIsClosing(false);
    if (courseName) setFormData((prev) => ({ ...prev, course: courseName }));
    const dialog = document.getElementById(modalId) as HTMLDialogElement;
    dialog?.showModal();
  };

  const closeModal = () => {
    setIsClosing(true);
    // Wait for the exit animation to finish before actually closing
    setTimeout(() => {
      const dialog = document.getElementById(modalId) as HTMLDialogElement;
      dialog?.close();
      setIsClosing(false);
    }, 200);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /** Restrict phone input to digits only */
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow digits and simple formatting chars, but storing digits is cleanest
    // Removing restriction on 10 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 15); 
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        reset();
        closeModal();
        toast.success("Thank You, Our Agents Will Contact You Soon.");
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit form. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isClosing,
    openModal,
    closeModal,
    handleChange,
    handlePhoneChange,
    handleSubmit,
  };
}

// ── ContactUsButton ─────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost";

interface ContactUsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  outline: "btn-outline btn-primary",
  ghost: "btn-ghost",
};

export function ContactUsButton({
  text,
  variant = "primary",
  className,
  ...props
}: ContactUsButtonProps) {
  const MODAL_ID = "contact_modal";
  const form = useContactForm(MODAL_ID);

  return (
    <>
      <button
        onClick={() => form.openModal()}
        className={twMerge(
          "btn uppercase font-sans rounded-md md:btn-md",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {text ?? "Enquire Now"}
      </button>

      <dialog id={MODAL_ID} className="modal font-sans backdrop-blur-sm">
        <div
          className={twMerge(
            "modal-box max-w-3xl bg-gradient-to-br from-white to-gray-50 flex flex-col no-scrollbar items-stretch gap-6 transition-all duration-300 shadow-2xl border border-gray-100 rounded-2xl p-8",
            form.isClosing
              ? "scale-95 opacity-0"
              : "scale-100 opacity-100"
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-3xl text-black/80 underline decoration-4 decoration-orange-500">
                Enquiry Form
              </h3>
              <p className="text-sm text-gray-500 mt-1">Fill in your details and we'll get back to you soon</p>
            </div>
            <button
              onClick={form.closeModal}
              className="btn btn-circle btn-ghost btn-sm hover:bg-gray-100 hover:rotate-90 transition-all duration-300"
              aria-label="Close"
            >
              <CgClose className="w-5 h-5" />
            </button>
          </div>

          <SharedForm form={form} modalId={MODAL_ID} />
        </div>
        {/* Backdrop — click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={form.closeModal}>close</button>
        </form>
      </dialog>
    </>
  );
}

// ── Shared Form Body ────────────────────────────────────────────────

function SharedForm({
  form,
}: {
  form: ReturnType<typeof useContactForm>;
  modalId: string;
}) {
  return (
    <form
      onSubmit={form.handleSubmit}
      method="dialog"
      className="flex flex-col w-full gap-5 mt-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Name" error={form.errors.name}>
          <div className="relative group">
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={form.formData.name}
              onChange={form.handleChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>

        <FormField label="Email" error={form.errors.email}>
          <div className="relative group">
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              spellCheck={false}
              value={form.formData.email}
              onChange={form.handleChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Phone Number" error={form.errors.phone}>
          <div className="relative group flex gap-2">
            <div className="w-[140px] flex-shrink-0">
              <CustomSelect
                value={form.formData.countryCode}
                onChange={(value) => {
                  const syntheticEvent = {
                    target: { name: "countryCode", value },
                  } as ChangeEvent<HTMLSelectElement>;
                  form.handleChange(syntheticEvent);
                }}
                options={ALL_COUNTRY_CODES.map(c => ({ 
                  label: `${c.name} (${c.dial_code})`, 
                  value: c.code 
                }))}
                placeholder="Select Country"
              />
            </div>
            <input
              type="tel"
              name="phone"
              inputMode="tel"
              placeholder="Mobile number"
              value={form.formData.phone}
              onChange={form.handlePhoneChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>

        <FormField label="State / Union Territory" error={form.errors.state}>
          <CustomSelect
            value={form.formData.state}
            onChange={(value) => {
              const syntheticEvent = {
                target: { name: "state", value },
              } as ChangeEvent<HTMLSelectElement>;
              form.handleChange(syntheticEvent);
            }}
            options={INDIAN_STATES}
            placeholder="Choose your State/UT"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Work Experience">
          <CustomSelect
            value={form.formData.experience}
            onChange={(value) => {
              const syntheticEvent = {
                target: { name: "experience", value },
              } as ChangeEvent<HTMLSelectElement>;
              form.handleChange(syntheticEvent);
            }}
            options={EXPERIENCES}
            placeholder="Select your experience"
            showSearch={false}
          />
        </FormField>

        <FormField label="College/Company" error={form.errors.organization}>
          <div className="relative group">
            <input
              type="text"
              name="organization"
              placeholder="Where do you study/work?"
              value={form.formData.organization}
              onChange={form.handleChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700 block">
          Do you already have a certification?*
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="certification"
              value="No"
              checked={form.formData.certification === "No"}
              onChange={form.handleChange}
              className="radio radio-sm checked:bg-primary border-2 group-hover:border-primary transition-colors"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">No</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="certification"
              value="Yes"
              checked={form.formData.certification === "Yes"}
              onChange={form.handleChange}
              className="radio radio-sm checked:bg-primary border-2 group-hover:border-primary transition-colors"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">Yes</span>
          </label>
        </div>
      </div>

      {form.errors.submit && (
        <div className="alert alert-error text-sm py-3 rounded-xl shadow-lg border border-error/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{form.errors.submit}</span>
        </div>
      )}

      <div className="flex justify-end mt-2 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={form.isSubmitting}
          className="btn btn-primary w-full md:w-auto px-10 uppercase shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100 rounded-xl text-base font-semibold"
        >
          {form.isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Sending...
            </>
          ) : (
            <>
              Submit Enquiry
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ── Form Field ──────────────────────────────────────────────────────

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-semibold text-gray-700">
        {label}<span className="text-error ml-0.5">*</span>
      </label>
      {children}
      {error && (
        <p className="text-error text-xs mt-2 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
