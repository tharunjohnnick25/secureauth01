import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Shield, Smartphone, Bell, LogOut, Activity, CheckCircle, XCircle } from 'lucide-react-native';

export default function DashboardScreen() {
  const [pendingRequest, setPendingRequest] = useState({
    id: 'REQ-123',
    service: 'Admin Console Login',
    location: 'New York, US',
    device: 'Chrome on MacOS',
  });

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  const handleApprove = () => {
    Alert.alert('Request Approved', 'The authentication request has been verified.');
    setPendingRequest(null);
  };

  const handleDeny = () => {
    Alert.alert('Request Denied', 'Security alert has been logged.');
    setPendingRequest(null);
  };

  const stats = [
    { label: 'Risk Level', value: 'Low', color: '#00ff66', icon: Shield },
    { label: 'Active Devices', value: '2', color: '#00f0ff', icon: Smartphone },
    { label: 'Alerts', value: pendingRequest ? '1' : '0', color: '#ff003c', icon: Bell },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.userName}>Security Admin</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <LogOut size={20} color="#ff003c" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <stat.icon size={24} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {pendingRequest && (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Bell size={20} color="#ff003c" />
              <Text style={styles.requestTitle}>Pending Approval</Text>
            </View>
            <View style={styles.requestDetails}>
              <Text style={styles.requestText}>Service: <Text style={styles.bold}>{pendingRequest.service}</Text></Text>
              <Text style={styles.requestText}>Location: <Text style={styles.bold}>{pendingRequest.location}</Text></Text>
              <Text style={styles.requestText}>Device: <Text style={styles.bold}>{pendingRequest.device}</Text></Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleDeny} style={[styles.actionButton, styles.denyButton]}>
                <XCircle size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Deny</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApprove} style={[styles.actionButton, styles.approveButton]}>
                <CheckCircle size={20} color="#000" />
                <Text style={[styles.actionButtonText, { color: '#000' }]}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: 'rgba(0, 255, 102, 0.1)' }]}>
                <Activity size={18} color="#00ff66" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityAction}>Login Success</Text>
                <Text style={styles.activityTime}>Mobile App • Just now</Text>
              </View>
              <Text style={styles.activityStatus}>Secure</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  welcome: {
    color: '#666',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 60, 0.1)',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  requestCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 60, 0.3)',
    padding: 20,
    marginBottom: 32,
    shadowColor: '#ff003c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  requestTitle: {
    color: '#ff003c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestDetails: {
    gap: 8,
    marginBottom: 20,
  },
  requestText: {
    color: '#aaa',
    fontSize: 14,
  },
  bold: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  denyButton: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
  },
  approveButton: {
    backgroundColor: '#00f0ff',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activityTime: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  activityStatus: {
    color: '#00ff66',
    fontSize: 12,
    fontWeight: '600',
  },
});
