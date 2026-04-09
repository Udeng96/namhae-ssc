package com.eseict.ssc.util;

import com.google.api.services.youtube.model.SearchResult;

import java.util.Comparator;

public class YouTubeDateComparator implements Comparator<SearchResult> {
    @Override
    public int compare(SearchResult o1, SearchResult o2) {
        return Long.compare(o2.getSnippet().getPublishedAt().getValue(), o1.getSnippet().getPublishedAt().getValue());
    }
}
