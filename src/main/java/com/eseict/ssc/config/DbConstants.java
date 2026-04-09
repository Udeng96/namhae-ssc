package com.eseict.ssc.config;

public class DbConstants {
    public static class Rino {
        public static final String entity_manager_factory_ref ="rinoEm";
        public static final String transaction_manager_ref ="rinoTm";
    }

    public static class Sms{
        public static final String entity_manager_factory_ref ="smsEntityManagerFactory";
        public static final String transaction_manager_ref ="smsEntityTransactionManager";
    }

    public static class Broadcast{
        public static final String entity_manager_factory_ref ="broadcastEntityManagerFactory";
        public static final String transaction_manager_ref ="broadcastEntityTransactionManager";
    }
    public static class Billboard{
        public static final String entity_manager_factory_ref ="billboardEntityManagerFactory";
        public static final String transaction_manager_ref ="billboardEntityTransactionManager";
    }
    public static final String MCS_SCHEMA = "mcs";
}
