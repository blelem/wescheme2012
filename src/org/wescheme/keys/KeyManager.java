package org.wescheme.keys;

import java.util.Collections;
import java.util.logging.Logger;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;
import javax.jdo.PersistenceManager;

import org.wescheme.util.CacheHelpers;
import org.wescheme.util.Crypt;
import org.wescheme.util.PMF;
import org.wescheme.util.Crypt.KeyNotFoundException;


public class KeyManager {
	
	static Logger logger = Logger.getLogger(KeyManager.class.getName());


	public static int DEFAULT_KEY_SIZE = 8;
	
	static {
		// ensure that freshKey and staleKey keys exist, even in a clean database.
		String[] keyNames = {"freshKey", "staleKey"};

		for (int i = 0; i < keyNames.length; i++){
			PersistenceManager pm = PMF.get().getPersistenceManager();
			Cache cache = CacheHelpers.getCache();
			try { 
				retrieveKey(pm, cache, keyNames[i]); 
			} catch (KeyNotFoundException e) {
				storeKey(pm, cache, generateNewKey(keyNames[i], DEFAULT_KEY_SIZE));
			}
		}
		
	}
	
	public static void rotateKeys() throws KeyNotFoundException, CacheException{
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			logger.info("rotateKeys called");
			KeyScheduleList keySchedule = KeyScheduleList.getInstance();
			keySchedule.clockTick();
		} finally {
			pm.close();
		}
	}
	

	@SuppressWarnings("unchecked")
	public static void storeKey(PersistenceManager pm, Cache c, Crypt.Key key){
		c.put(key.getName(), key);
		pm.makePersistent(key);
	}

	
	@SuppressWarnings("unchecked")
	public static Crypt.Key retrieveKey(PersistenceManager pm, Cache c, String keyName) throws KeyNotFoundException{
		Crypt.Key inMemoryKey = getFromInMemoryCache(keyName, c);
		if (inMemoryKey != null) {
			return inMemoryKey;
		} else  {
			Crypt.Key inDbKey = getFromPersistentStorage(pm, keyName);
			c.put(keyName, inDbKey);
			return inDbKey;
		}
	}
	
	private static Crypt.Key getFromInMemoryCache(String keyName, Cache c) {
		Object o = (Crypt.Key) c.get(keyName);

		// attempt to fetch the key from the cache
		if( o != null && o instanceof Crypt.Key ){
			logger.info("retrieved key " + keyName + " from in-memory cache.");
			return (Crypt.Key) o;
		}
		return null;
	}
	

	private static Crypt.Key getFromPersistentStorage(PersistenceManager pm,
			String keyName) throws KeyNotFoundException {
		Object o;
		try {
			//Key k = KeyFactory.createKey(Crypt.Key.class.getName(), keyName);
			// FIXME: Why would this fail?
			o = pm.getObjectById(Crypt.Key.class, keyName);
			logger.info("retrieved key " + keyName + " from persistent cache.");
			return (Crypt.Key) o;	
		} catch (Exception e){
			logger.warning("Exception occured while looking up key " + keyName);
			logger.warning(e.toString());
			throw new Crypt.KeyNotFoundException();
		}
	}

	public static Crypt.Token generateToken(String text, String keyName){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			try {
				CacheFactory cf;
				cf = CacheManager.getInstance().getCacheFactory();
				Cache cache = cf.createCache(Collections.emptyMap());
				Crypt.Key k = KeyManager.retrieveKey(pm, cache, keyName);
				return generateToken(text, k);
			} catch (Exception e) {
				return null;
			}
		} finally {
			pm.close();
		}
	}

	public static Crypt.Token generateToken(String text, Crypt.Key k){
		return new Crypt.Token(text, k);
	}

	
	
	public static Crypt.Key generateNewKey(String keyName, int size) {
		Crypt.Key key;
		logger.info("Generating a " + (size * 8) + " bit key named " + keyName + ".");
		key = new Crypt.Key(keyName, Crypt.getBytes(size));
		return key;
	}
}
