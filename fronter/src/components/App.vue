<script setup>
import { onMounted, ref, computed, watch } from "vue";
import axios from "axios";
import Qrcodevue from "qrcode.vue";
import backgroundImage from "../assets/bg.png";

const longURL = ref("");
const shortUrl = ref(null);
const url = ref("");
const datas = ref([]);
const counts = ref(0);
const shortenUrl2 = ref(null);
async function geturls() {
  try {
    const API = "https://urlbackend-x12i.onrender.com/all";
    const res = await fetch(API);
    if (res.ok) return res.json();
    else if (res.status === 401) {
      revokeToken();
    } else throw new Error("Error, data is error!");
  } catch (error) {
    return null;
  }
}
onMounted(async () => {
  datas.value = await geturls();
  console.log(datas.value);
});

const fetchData = async (x) => {
  console.log(x);
  console.log(datas.clicks);
  try {
    const response = await fetch(`${x}`);

    console.log(response);
    if (response.ok) {
      const data = await response.json();
      longURL.value = data.longURL;
    } else if (response.status === 404) {
      console.log("Not found");
    } else {
      console.error("Error fetching data");
    }
  } catch (error) {}
  datas.value = await geturls();
};

async function shortenUrl() {
  const response = await fetch("https://urlbackend-x12i.onrender.com/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longURL: longURL.value }),
  });

  console.log(datas.value);
  datas.value = await geturls();
  fetchData();
  const data = await response.json();
  shortUrl.value = data;
  // longURL.value = ""
  // longURL.value = longURL.value;
  shortenUrl2.value = data;
}

const clearText =()=>{
 longURL.value = ""
  shortUrl.value = ""
}

const Deletefunc = async(id)=>{

  try {
      const res = await fetch(`https://urlbackend-x12i.onrender.com/${id}`, { 
        method: "DELETE",
      })
      if (res.ok) {
        datas.value = await geturls()
      }else if(res.status === 401){
        console.log("Error 401");
      }
      else { throw new error('Error, cannot get data') }
    } catch (error) {
      console.error(error)
    }





  console.log('CLick delete');


}
</script>
<template>
  <div class="h-screen w-full flex flex-col bg-slate-300">
    <div class="w-full text-center text-9xl font-bold text-blue-950 ">URL SHORTEN</div>
    <div class="w-full items-center flex justify-center p-11">
      <input
        v-model="longURL"
        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-96 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        id="inline-full-name"
        type="text"
        placeholder="Enter a long URL"
      />

      <button
      :class="longURL.length === 0 ? 'bg-gray-500'  : 'bg-blue-700 hover:bg-blue-900'"
        class="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded" 
        @click="shortenUrl(longURL)" :disabled="longURL.length === 0 " 
      >
        Shorten
      </button>

      <button
        class="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded ml-5"
        @click="clearText()"
      >
        Clear
      </button>
    </div>

    <div class="flex justify-center ">
      <div class="pb-6" v-if="shortUrl">
        <span class="font-bold text-3xl">Shortened URL : </span>
        <a :href="shortUrl" target="_blank">
          <span class="text-blue-600 text-2xl font-medium underline hover:text-blue-800" @click="fetchData(shortUrl)"
            >{{ shortenUrl2 }}
          </span></a
        >
      </div>
    </div>

    <div class="flex justify-center" v-if="shortUrl">
      <Qrcodevue  class=" shadow-2xl" :value="longURL" :size:="300" level="H"></Qrcodevue>
    </div>

    <div class="relative flex justify-center m-11 overflow-x-auto">
      <table
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow rounded-2xl"
      >
        <thead
          class="text-4xl text-white uppercase bg-blue-950 dark:bg-gray-700 dark:text-gray-400 text-center rounded-t-3xl sticky top-0"
        >
          <tr>
            <th scope="col" class="px-6 py-3">No.</th>
            <th scope="col" class="px-6 py-3 w-1/5 text-center">SHORTURL</th>
            <th scope="col" class="px-6 py-3">COUNT</th>
            <th scope="col" class="px-6 py-3">QR CODE</th>
            
          </tr>
        </thead>
        <tbody class="text-center overflow-y-auto">
          <tr
            v-for="(item, index) in datas"
            :key="index"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-4xl"
            >
              {{ index + 1 }}
            </th>
            <td class="px-6 py-4 text-center text-2xl  hover:text-blue-800">
              <a
                :href="item.shortURL"
                target="_blank"
                @click="fetchData(item.shortURL)"
                >{{ item.shortURL }}</a
              >
            </td>
            <td class="px-6 py-4 text-4xl">
              {{ item.clicks }}
            </td>
            <td class="px-6 py-4 flex justify-center">
              <Qrcodevue
                :value="item.longURL"
                :size:="200"
                level="H"
              > </Qrcodevue>  

              <div class=" pl-6 pt-8 text-3xl "> 
                <button @click="Deletefunc(item.shortUrlId)">❌</button>
              </div>
            </td>
            
          </tr>
        </tbody>
        <tbody v-if = "datas.length == 0" class="bg-white  h-32">
               <td colspan="4" class="px-6 py-4 text-4xl text-center">  No data</td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  background-repeat: repeat;
}

.background-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: inherit;
  /* Use the same background image as the parent */
  filter: blur(10px);
  /* Adjust the blur radius as needed */
  z-index: -1;
  /* Place it behind the content */
}
</style>
