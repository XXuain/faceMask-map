<template>
  <div id="app">
    <div class="row no-gutters">
      <div class="col-sm-3">
        <div class="toolbox">
          <div class="sticky-top bg-white shadow-sm p-2">
            <div class="form-group d-flex">
              <label for="cityName" class="mr-2 col-form-label text-right">縣市</label>
              <div class="flex-fill">
                <select
                  id="cityName"
                  class="form-control"
                  :class="{ isValid: select.city }"
                  v-model="select.city"
                  @change="updateSelect"
                >
                  <option value="">請選擇縣市...</option>
                  <option v-for="(name, index) in countryName" :key="index" :value="name">{{
                    name
                  }}</option>
                </select>
              </div>
            </div>
            <div class="form-group d-flex">
              <label for="area" class="mr-2 col-form-label text-right">地區</label>
              <div class="flex-fill">
                <select
                  id="area"
                  class="form-control"
                  :class="{ isInvalid: select.area }"
                  v-model="select.area"
                  @change="updateMap"
                >
                  <option value="">-- Select One --</option>
                  <option v-for="(area, index) in areayName" :key="index" :value="area.AreaName">{{
                    area.AreaName
                  }}</option>
                </select>
              </div>
            </div>
            <p class="mb-0 small text-muted text-right">請先選擇區域查看（綠色表示還有口罩）</p>
          </div>
          <ul class="list-group">
            <template>
              <a class="list-group-item text-left">
                <h3>藥局名稱</h3>
                <p class="mb-0">
                  成人口罩：1 | 兒童口罩：2
                </p>
                <p class="mb-0">
                  地址：<a
                    href="https://www.google.com.tw/maps/place/..."
                    target="_blank"
                    title="Google Map"
                  >
                    地址</a
                  >
                </p>
              </a>
            </template>
          </ul>
        </div>
      </div>

      <!-- map -->
      <div class="col-sm-9">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 圖層套件
import L from "leaflet";
import countryData from "./assets/countryName.json";

let osmMap = {};

// icon style handle
const iconsConfig = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
};
const icons = {
  green: new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    ...iconsConfig
  }),
  grey: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
    ...iconsConfig
  })
};

// osm fun
const osm = {
  addMapMarker(x, y, item) {
    const icon = item.mask_adult || item.mask_child ? icons.green : icons.grey;
    L.marker([y, x], { icon }).addTo(osmMap).bindPopup(`<strong>${item.name}</strong> <br>
    口罩剩餘：<strong>成人 - ${item.mask_adult ? `${item.mask_adult} 個` : "未取得資料"}/ 兒童 - ${
      item.mask_child ? `${item.mask_child} 個` : "未取得資料"
    }</strong><br>
    地址: <a href="https://www.google.com.tw/maps/place/${item.address}" target="_blank">${
      item.address
    }</a><br>
    電話: ${item.phone}<br>
    <small>最後更新時間: ${item.updated}</small>`);
  },
  removeMapMarker() {
    osmMap.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        osmMap.removeLayer(layer);
      }
    });
  },
  penTo(x, y, item) {
    const icon = item.mask_adult || item.mask_child ? icons.green : icons.grey;
    osmMap.panTo(new L.LatLng(y, x));
    L.marker([y, x], {
      icon
    })
      .addTo(osmMap)
      .bindPopup(
        `<strong>${item.name}</strong> <br>
    口罩剩餘：<strong>成人 - ${item.mask_adult ? `${item.mask_adult} 個` : "未取得資料"}/ 兒童 - ${
          item.mask_child ? `${item.mask_child} 個` : "未取得資料"
        }</strong><br>
    地址: <a href="https://www.google.com.tw/maps/place/${item.address}" target="_blank">${
          item.address
        }</a><br>
    電話: ${item.phone}<br>
    <small>最後更新時間: ${item.updated}</small>`
      )
      .openPopup();
  }
};

export default {
  name: "App",
  data: () => ({
    pharmcyData: [],
    countryData,
    countryName: [],
    areayName: [],
    select: {
      city: "",
      area: ""
    }
  }),
  methods: {
    updateMap() {
      // 清除 marker
      this.removeMarker();

      // 該縣市所有的藥局名稱
      const localPharmacies = this.pharmcyData.filter(
        pharmcy =>
          pharmcy.properties.county === this.select.city &&
          pharmcy.properties.town === this.select.area
      );

      // 依據 選到的城市做顯示 加上標籤
      localPharmacies.forEach(i => {
        let { properties, geometry } = i;
        osm.addMapMarker(geometry.coordinates[0], geometry.coordinates[1], properties);
      });
      this.penTo(localPharmacies[0]);
    },
    penTo(pharmacy) {
      const { properties, geometry } = pharmacy;
      osm.penTo(geometry.coordinates[0], geometry.coordinates[1], properties);
    },
    updateSelect() {
      this.areayName = [];
      this.select.area = "";
      this.countryData.forEach(i => {
        i.CityName === this.select.city && (this.areayName = i.AreaList);
      });
    },
    removeMarker() {
      osm.removeMapMarker();
    }
  },
  mounted() {
    // 藥局資料
    const url = "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";
    this.$http.get(url).then(res => {
      this.pharmcyData = res.data.features;
      // this.updateMap();
    });

    // 建立圖層 default taipei
    osmMap = L.map("map", {
      center: [25.03, 121.55],
      zoom: 13
    });

    // 圖層匯入圖磚
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
      foo: "bar",
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(osmMap);
  },
  created() {
    this.countryName = this.countryData.map(i => i.CityName);
  }
};
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap";
#map {
  height: 100vh;
}
.highlight {
  background: #e9ffe3;
}
.toolbox {
  height: 100vh;
  overflow-y: auto;
  a {
    cursor: pointer;
  }
}
</style>
