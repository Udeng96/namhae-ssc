import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ReactDOM from 'react-dom/client'

//common
import '../src/assets/common/css/common.css'
import '../src/assets/common/css/content.css'
import '../src/assets/common/css/gis.css'
import '../src/assets/common/css/reset.css'
import '../src/assets/common/css/top-bar.css'
import '../src/assets/common/css/modal.css'

import '../src/assets/common/css/calendar.css'
import '../src/assets/common/css/datePicker.css'
import '../src/assets/common/css/lnb.css'
import '../src/assets/common/css/search.css'
import '../src/assets/common/css/selectBox.css'
import '../src/assets/common/css/tree.css'
import '../src/assets/common/css/tui-date-picker.css'
import '../src/assets/common/css/tui-tree.css'
import "react-checkbox-tree/lib/react-checkbox-tree.css"

import "../src/assets/css/datePicker.css"
import '../src/assets/css/tree.css'
import "../src/assets/css/fullCalendar.css"
import "../src/assets/css/statistics/statistics.css"
import '../src/assets/css/slick.css'

import {Reset} from "styled-reset";
import Router from "@/component/router";
import Highcharts from "highcharts/highstock";

Highcharts.setOptions({ lang: { thousandsSep: ',' } });


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
        <QueryClientProvider client={queryClient}>
            <Reset/>
            <Router/>
        </QueryClientProvider>
)
