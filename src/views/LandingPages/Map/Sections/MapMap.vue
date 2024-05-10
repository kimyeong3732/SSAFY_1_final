<template>
  <section>
    <div ref="mapContainer" style="width: 100%; height: 500px"></div>
        
  </section>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue'

  const mapContainer = ref(null) // 지도를 담을 ref 생성

  let map = null
  let markers = []
  let bounds = null
  let infowindow = new kakao.maps.InfoWindow({ zIndex: 9000 })

  onMounted(() => {
    kakao.maps.load(() => {
        const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
        }

        map = new kakao.maps.Map(mapContainer.value, options)
        bounds = new kakao.maps.LatLngBounds()
    })
  })
</script>