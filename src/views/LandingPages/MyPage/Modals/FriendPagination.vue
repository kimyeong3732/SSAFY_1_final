<template>
    <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
            <li class="page-item" v-if="currentPageGroup > 1">
                <a class="page-link" href="#" @click.prevent="goToPreviousGroup">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" v-for="page in currentGroupPages" :key="page" :class="{ active: page === currentPage }">
                <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" v-if="currentPageGroup < totalPageGroups">
                <a class="page-link" href="#" @click.prevent="goToNextGroup">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    totalPages: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['change-page']);

const pagesPerGroup = 10;
const currentPageGroup = computed(() => Math.ceil(props.currentPage / pagesPerGroup));
const totalPageGroups = computed(() => Math.ceil(props.totalPages / pagesPerGroup));

const currentGroupPages = computed(() => {
    const start = (currentPageGroup.value - 1) * pagesPerGroup + 1;
    const end = Math.min(start + pagesPerGroup - 1, props.totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const goToPage = (page) => {
    emit('change-page', page);
};

const goToPreviousGroup = () => {
    const previousGroupPage = (currentPageGroup.value - 1) * pagesPerGroup;
    emit('change-page', previousGroupPage);
};

const goToNextGroup = () => {
    const nextGroupPage = currentPageGroup.value * pagesPerGroup + 1;
    emit('change-page', nextGroupPage);
};
</script>