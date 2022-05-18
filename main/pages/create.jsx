import Header from "../components/Header";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { create as IPFSHTTPClient } from "ipfs-http-client";
import { ethers } from "ethers";
import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json';


const client = IPFSHTTPClient("https://ipfs.infura.io:5001/api/v0");

const people = [
  { name: "Wade Cooper" },
  { name: "Arlene Mccoy" },
  { name: "Devon Webb" },
  { name: "Tom Cook" },
];

function create() {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [storyUrl, setStoryUrl] = useState();
  const [imageUrl, setImageUrl] = useState();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [address,setAddress] = useState("");



  const run = () => {
    console.log(title, story, amount, selected.name, image );
    console.log(storyUrl, imageUrl);
    console.log(address);
  };
  const [image, setImage] = useState(null);

  const ImageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const [selected, setSelected] = useState(people[0]);

  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploadLoading(true);

    if (story !== "") {
      try {
        const added = await client.add(story);
        setStoryUrl(added.path);
      } catch (error) {
        console.log(`Error Uploading Story`);
      }
    }

    if (image !== null) {
      try {
        const added = await client.add(image);
        setImageUrl(added.path);
      } catch (error) {
        console.log(`Error Uploading Image`);
      }
    }

    setUploadLoading(false);
    setUploaded(true);
    setUploaded(true);
    console.log("Files Uploaded Sucessfully");
  };


  const startCampaign = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if(title === "") {
      console.log("Title Field Is Empty");
    } else if(story === "" ) {
      console.log("Story Field Is Empty");
    } else if(amount === "") {
      console.log("Required Amount Field Is Empty");
    } else if(uploaded == false) {
        console.log("Files Upload Required")
    }
    else {        
      setLoading(true);  

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        signer
      );
        
      const CampaignAmount = ethers.utils.parseEther(amount);

      const campaignData = await contract.createCampaign(
        title,
        CampaignAmount,
        imageUrl,
        selected.name,
        story
      );

      await campaignData.wait();   

      setAddress(campaignData.to);
    }
}

  return (
    <div className="bg-gradient-to-b from-[#041d2b] via-[#041d2b] to-[#072d42] min-w-full min-h-[100vh]">
      <Header />

      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-4 lg:grid-cols-2 sm:max-w-[90%]">
          <form>
            <div class="mt-8 space-y-6 ">
              <div>
                <label
                  for="name"
                  class="text-lg mb-4 text-white block  font-semibold"
                >
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="campaignsTitle"
                  id="name"
                  onChange={(e) => setTitle(e.target.value)}
                  class="h-[50px] rounded-lg bg-gray-100 border border-gray-100 focus:outline-none font-semibold   py-1 px-3 block  text-black text-lg w-full"
                  placeholder="Enter Campaign Title Here"
                />
              </div>

              <div className="mt-32">
                <label
                  for="text"
                  class="text-lg mb-4 text-white block  font-semibold"
                >
                  Campaign Story
                </label>
                <textarea
                  type="text"
                  name="email"
                  id="email"
                  rows="6"
                  cols="50"
                  class="bg-gray-100 border rounded-lg focus:outline-none font-semibold border-gray-200    py-1 px-3 block focus:none text-black text-lg w-full"
                  placeholder="Enter Campaign Story Here"
                  onChange={(e) => setStory(e.target.value)}
                />
              </div>
            </div>
          </form>

          <div>
            <div class="p-8   ">
              <form>
                <div class=" grid lg:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="number"
                      class="text-lg mb-4 text-white block  font-semibold"
                    >
                      Required Amount{" "}
                    </label>
                    <input
                      type="text"
                      name="amount"
                      id="name"
                      class="bg-gray-100 h-[50px] border rounded-lg focus:outline-none  font-semibold border-gray-100   py-1 px-3 block  text-black text-lg w-full"
                      placeholder=" $ 5000"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      for="email"
                      class="text-lg text-white  block mb-4 font-semibold"
                    >
                      Choose Categoies
                    </label>
                    <Listbox value={selected} onChange={setSelected}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-pointer h-[50px] rounded-lg font-semibold   bg-gray-100 py-1 pl-3 pr-10 text-left    sm:text-lg">
                          <span className="block truncate">
                            {selected.name}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg   bg-gray-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-lg">
                            {people.map((person, personIdx) => (
                              <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                  `relative cursor-default select-none  py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-puple-100 text-blue-900"
                                      : "text-black"
                                  }`
                                }
                                value={person}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-medium"
                                      }`}
                                    >
                                      {person.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                        {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <label class=" mt-3">
                    <label
                      for="file"
                      class="text-lg text-white block mb-3 font-semibold"
                    >
                      Select Profile Image
                    </label>
                    <span class="sr-only text-lg font-semibold ">
                      Choose File
                    </span>
                    <input
                      type="file"
                      class="block w-full  text-md font-semibold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 hover:file:bg-[#4588F7]"
                      onChange={ImageHandler}
                    />
                  </label>
                </div>

                <div class="space-x-4 mt-12">
                  {/* {uploadLoading == true ? <button
                    type="submit"
                    class="py-2 px-4 bg-[#0b2e67] text-white  rounded-lg font-semibold hover:bg-[#1855b7] active:bg-blue-700 disabled:opacity-50"
                    onClick={uploadFiles}
                  >
                    Upload Files to IPFS
                  </button> :
        uploaded == false ? 
                  <button
                    type="submit"
                    class="py-2 px-4 bg-[#0b2e67] text-white  rounded-lg font-semibold hover:bg-[#1855b7] active:bg-blue-700 disabled:opacity-50"
                    onClick={uploadFiles}
                  >
                    Upload Files to IPFS
                  </button>:  <button
                    type="submit"
                    class="py-2 px-4 bg-[#0b2e67] text-white  rounded-lg font-semibold hover:bg-[#1855b7] active:bg-blue-700 disabled:opacity-50"
                    onClick={uploadFiles}
                  >
                } */}

                  {uploadLoading == true ? (
                    <button
                      type="submit"
                      class="py-2 px-4 bg-[#cdc845] text-white  rounded-lg font-semibold "
                 
                    >
                      {" "}
                      File Uploading{" "}
                    </button>
                  ) : uploaded == false ? (
                    <button
                      type="submit"
                      class="py-2 px-4 bg-[#0b2e67] text-white  rounded-lg font-semibold"
                      onClick={uploadFiles}
                    >
                      {" "}
                      Upload Files to IPFS{" "}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      class="py-2 px-4 bg-[#317e30] text-white  rounded-lg font-semibold "
              
                    >
                      {" "}
                      File Upload Sucessfully{" "}
                    </button>
                  )}

                  {loading == true ? (
                    <button
                      type="submit"
                      class="py-2 px-4 bg-[#cdc845] text-white  rounded-lg font-semibold "
                     
                    >
                      {" "}
                      File Uploading{" "}
                    </button>
                  ) : loading == false ? (
                    <button
                      type="submit"
                      class="py-2 px-4 bg-[#0b2e67] text-white  rounded-lg font-semibold"
                      onClick={startCampaign}
                    >
                      {" "}
                      Start Campaign{" "}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      class="py-2 px-4 bg-[#317e30] text-white  rounded-lg font-semibold "
                      
                    >
                      {" "}
                      File Upload Sucessfully{" "}
                    </button>
                  )}

                  {/* <button class="py-2 px-4 bg-[#0b2e67] border-none text-white rounded-lg font-semibold  hover:bg-[#1855b7] active:bg-gray-200 disabled:opacity-50">
                    Start Campaign
                  </button> */}
                  <button onClick={run()} class="py-2 px-4  bg-[#0b2e67] border-none text-white rounded-lg font-semibold  hover:bg-[#1855b7] active:bg-gray-200 disabled:opacity-50">
                    Start Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default create;
